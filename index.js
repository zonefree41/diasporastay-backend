// -------------------------
// ✅ DiasporaStay Backend (index.js)
// -------------------------
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";
import mongoose from "mongoose";
import Booking from "./diasporastay/src/models/Booking.js";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";
import Owner from "./diasporastay/src/models/Owner.js"; // make sure you import it

dotenv.config();

const app = express();

// -------------------------
// ✅ CORS & Middleware
// -------------------------
// ✅ place this at the very top before any routes or JSON parsing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

// optional whitelist if you want stricter control
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://diasporastay.vercel.app",
    "https://diasporastay-live.vercel.app",
];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn("❌ CORS blocked for origin:", origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());

// -------------------------
// ✅ MongoDB Connection
// -------------------------
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("MongoDB Error:", err));

// -------------------------
// ✅ Stripe Setup
// -------------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------
// ✅ Load Country Gateways
// -------------------------
let gateways = {};
try {
    gateways = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "gatewaySupport.json"), "utf-8")
    );
} catch (err) {
    console.warn("⚠️ gatewaySupport.json not found, skipping.");
}

app.get("/api/gateway/:country", (req, res) => {
    const country = req.params.country;
    const options = gateways[country] || [];
    res.json({ country, gateways: options });
});

// -------------------------
// ✅ Stripe Webhook (payment confirmation)
// -------------------------
app.post(
    "/api/stripe/webhook",
    bodyParser.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("⚠️ Webhook signature error:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            console.log("✅ Payment success:", session.id);

            // Update booking to "paid"
            const booking = await Booking.findOneAndUpdate(
                { stripeSessionId: session.id },
                { status: "paid" },
                { new: true }
            );

            if (!booking) return res.json({ received: true });

            // Find hotel owner
            const owner = await Owner.findOne({
                email: booking.ownerEmail,
                stripeVerified: true,
            });

            if (!owner) {
                console.warn("⚠️ Owner not found or not verified.");
                return res.json({ received: true });
            }

            // Calculate payout: keep 15% commission
            const commissionRate = 0.15;
            const ownerPayout = booking.total * (1 - commissionRate);

            try {
                // ✅ Create Stripe transfer to owner
                const transfer = await stripe.transfers.create({
                    amount: Math.round(ownerPayout * 100),
                    currency: "usd",
                    destination: owner.stripeAccountId,
                    description: `DiasporaStay payout for ${booking.hotelName}`,
                });

                booking.transferStatus = "sent";
                await booking.save();

                console.log(`💸 Transfer sent to ${owner.email}: ${transfer.id}`);
            } catch (err) {
                console.error("❌ Stripe transfer failed:", err);
            }
        }

        res.json({ received: true });
    }
);

// -------------------------
// ✅ Stripe Checkout Session
// -------------------------
app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const { hotel, nights, guests, email } = req.body;
        const total = hotel.price * nights;
        const YOUR_DOMAIN =
            process.env.NODE_ENV === "production"
                ? "https://diasporastay.vercel.app"
                : "http://localhost:5173";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${YOUR_DOMAIN}/success`,
            cancel_url: `${YOUR_DOMAIN}/cancel`,
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: hotel.name,
                            description: `${hotel.city}, ${hotel.country}`,
                            images: [hotel.image],
                        },
                        unit_amount: Math.round(hotel.price * 100),
                    },
                    quantity: nights,
                },
            ],
            metadata: {
                hotelId: hotel.id,
                hotelName: hotel.name,
                city: hotel.city,
                country: hotel.country,
                guests,
                nights,
                total,
            },
        });

        await Booking.create({
            hotelId: hotel.id,
            hotelName: hotel.name,
            city: hotel.city,
            country: hotel.country,
            guests,
            nights,
            total,
            email,
            stripeSessionId: session.id,
            status: "pending",
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("❌ Checkout Session Error:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

// ======== STRIPE CONNECT ONBOARDING ========

// create connected account for hotel owner


app.post("/api/stripe/connect-account", async (req, res) => {
    const { country, email, name } = req.body;

    const supported = ["GH", "KE", "NG", "ZA"];
    if (!supported.includes(country)) {
        return res.status(400).json({
            error: "Stripe Connect is not supported for this country yet",
        });
    }

    try {
        const account = await stripe.accounts.create({
            type: "express",
            country,
            email,
            business_type: "individual",
            capabilities: { transfers: { requested: true } },
            business_profile: {
                product_description: "Hotel owner receiving payouts via DiasporaStay",
            },
            metadata: { platform: "diasporastay" },
        });

        // ✅ Save or update owner in DB
        await Owner.findOneAndUpdate(
            { email },
            {
                name,
                email,
                country,
                stripeAccountId: account.id,
                stripeVerified: false,
            },
            { upsert: true, new: true }
        );

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: "https://diasporastay-live.vercel.app/owner/onboarding/refresh",
            return_url: "https://diasporastay-live.onrender.com/owner/onboarding/success",
            type: "account_onboarding",
        });

        res.json({ url: accountLink.url, accountId: account.id });
    } catch (err) {
        console.error("Stripe Connect error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Create Stripe Connect Express account + onboarding link
// ✅ Stripe Connect Account creation (for hotel owners)
// ✅ Create Stripe Connect account for hotel owners
app.post("/api/stripe/connect-account", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        // Create an Express account
        const account = await stripe.accounts.create({
            type: "express",
            country: "US", // or "NG" for Nigeria, "KE" for Kenya, etc.
            email,
            capabilities: {
                transfers: { requested: true },
            },
        });

        // Create account onboarding link
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: "http://localhost:5173/owner-dashboard",
            return_url: "http://localhost:5173/owner-dashboard",
            type: "account_onboarding",
        });

        console.log("✅ Stripe account created:", account.id);
        res.json({ url: accountLink.url });
    } catch (err) {
        console.error("❌ Stripe connect error:", err);
        res.status(500).json({ error: err.message });
    }
});


// ✅ Verify Stripe account status
app.get("/api/owner/verify/:email", async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) return res.status(400).json({ error: "Email required" });

        // This is where you'd fetch the account ID linked to that email from MongoDB
        // For demo: assume stored manually or test mode
        const fakeAccountId = "acct_1234"; // replace this dynamically later

        const account = await stripe.accounts.retrieve(fakeAccountId);
        res.json({
            email,
            stripeAccountId: account.id,
            stripeVerified: account.details_submitted,
        });
    } catch (err) {
        console.error("Stripe verify error:", err);
        res.status(500).json({ error: "Failed to verify Stripe account" });
    }
});


// ✅ Verify Stripe Account (check status)
app.get("/api/owner/verify/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const owner = await Owner.findOne({ email });
        if (!owner) return res.status(404).json({ error: "Owner not found" });

        if (!owner.stripeAccountId)
            return res.json({ email, stripeVerified: false });

        const account = await stripe.accounts.retrieve(owner.stripeAccountId);

        const verified =
            account.details_submitted && account.charges_enabled && account.payouts_enabled;

        owner.stripeVerified = verified;
        await owner.save();

        res.json({
            email: owner.email,
            stripeAccountId: owner.stripeAccountId,
            stripeVerified: owner.stripeVerified,
        });
    } catch (err) {
        console.error("Stripe verify error:", err);
        res.status(500).json({ error: "Failed to verify Stripe account" });
    }
});

// ✅ Stripe onboarding success auto-verify
app.get("/api/stripe/onboarding/success", async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json({ error: "Email missing" });

        const owner = await Owner.findOne({ email });
        if (!owner || !owner.stripeAccountId) {
            return res.status(404).json({ error: "Owner not found" });
        }

        const account = await stripe.accounts.retrieve(owner.stripeAccountId);
        const verified =
            account.details_submitted && account.charges_enabled && account.payouts_enabled;

        owner.stripeVerified = verified;
        await owner.save();

        // redirect back to your frontend success page
        const frontendURL =
            process.env.NODE_ENV === "production"
                ? "https://diasporastay-live.vercel.app/owner/onboarding/success"
                : "http://localhost:5173/owner/onboarding/success";

        res.redirect(`${frontendURL}?verified=${verified}`);
    } catch (err) {
        console.error("Stripe onboarding verify error:", err);
        res.status(500).json({ error: err.message });
    }
});


// -------------------------
// ✅ Wise Payout (for international hotel owners)
// -------------------------
app.post("/api/payouts/wise", async (req, res) => {
    try {
        const { owner, amount, currency, bookingId } = req.body;

        const quoteRes = await axios.post(
            "https://api.sandbox.transferwise.tech/v3/quotes",
            {
                profile: process.env.WISE_PROFILE_ID,
                sourceCurrency: "USD",
                targetCurrency: currency,
                targetAmount: amount,
            },
            { headers: { Authorization: `Bearer ${process.env.WISE_API_TOKEN}` } }
        );

        const recipientRes = await axios.post(
            "https://api.sandbox.transferwise.tech/v2/accounts",
            {
                profile: process.env.WISE_PROFILE_ID,
                accountHolderName: owner.name,
                currency: owner.currency,
                type: "bank",
                details: owner.bankDetails,
            },
            { headers: { Authorization: `Bearer ${process.env.WISE_API_TOKEN}` } }
        );

        const transferRes = await axios.post(
            "https://api.sandbox.transferwise.tech/v3/transfers",
            {
                profile: process.env.WISE_PROFILE_ID,
                targetAccount: recipientRes.data.id,
                quote: quoteRes.data.id,
                reference: `Booking#${bookingId}`,
            },
            { headers: { Authorization: `Bearer ${process.env.WISE_API_TOKEN}` } }
        );

        await axios.post(
            `https://api.sandbox.transferwise.tech/v3/profiles/${process.env.WISE_PROFILE_ID}/transfers/${transferRes.data.id}/payments`,
            { type: "BALANCE" },
            { headers: { Authorization: `Bearer ${process.env.WISE_API_TOKEN}` } }
        );

        res.json({ success: true, transferId: transferRes.data.id });
    } catch (error) {
        console.error("Wise payout error:", error.message);
        res.status(500).json({ error: "Wise payout failed" });
    }
});

// -------------------------
// ✅ Payoneer Payout (alternative)
// -------------------------
app.post("/api/payouts/payoneer", async (req, res) => {
    try {
        const { ownerPayoneerId, amountUSD, bookingId } = req.body;

        const tokenRes = await axios.post(
            "https://api.payoneer.com/v1/oauth2/token",
            { grant_type: "client_credentials" },
            {
                auth: {
                    username: process.env.PAYONEER_CLIENT_ID,
                    password: process.env.PAYONEER_SECRET,
                },
            }
        );

        const payoutRes = await axios.post(
            "https://api.payoneer.com/payouts/v4/mass-payout",
            {
                payee_id: ownerPayoneerId,
                amount: amountUSD,
                currency: "USD",
                reference: `Booking#${bookingId}`,
            },
            { headers: { Authorization: `Bearer ${tokenRes.data.access_token}` } }
        );

        res.json({ success: true, data: payoutRes.data });
    } catch (error) {
        console.error("Payoneer payout error:", error.message);
        res.status(500).json({ error: "Payoneer payout failed" });
    }
});

// -------------------------
// ✅ Get Bookings
// -------------------------
app.get("/api/bookings", async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json({ error: "Email required" });
        const bookings = await Booking.find({ email }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// temporary mock route
app.get("/api/owner/bookings/:email", (req, res) => {
    const email = req.params.email;
    console.log("✅ Bookings requested for:", email);
    res.json([
        {
            _id: "1",
            hotelName: "Sunrise Lodge",
            total: 250,
            status: "completed",
            transferStatus: "sent",
            createdAt: new Date(),
        },
        {
            _id: "2",
            hotelName: "Ocean View Hotel",
            total: 180,
            status: "pending",
            transferStatus: "pending",
            createdAt: new Date(),
        },
    ]);
});


// -------------------------
// ✅ Root
// -------------------------
app.get("/", (req, res) =>
    res.send("🌍 DiasporaStay backend with Stripe, MongoDB, and Wise/Payoneer ✅")
);

// -------------------------
// ✅ Start Server
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
