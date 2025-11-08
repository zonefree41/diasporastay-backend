import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import mongoose from "mongoose";
import cors from "cors";
import Booking from "./models/Booking.js";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("MongoDB Error:", err));

// Regular middlewares
const allowedOrigins = [
    "http://localhost:5173",
    "https://diasporastay-live.vercel.app", // or your deployed frontend
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json());

// ✅ Stripe webhook route
app.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    async (request, response) => {
        const sig = request.headers["stripe-signature"];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("⚠️ Webhook signature verification failed:", err.message);
            return response.status(400).send(`Webhook Error: ${err.message}`);
        }

        // ✅ Handle successful payments
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('✅ Payment Success:', session.id);

            // Save booking
            await Booking.create({
                hotelName: session.metadata.hotelName,
                city: session.metadata.city,
                country: session.metadata.country,
                price: session.amount_total / 100,
                nights: session.metadata.nights,
                guests: session.metadata.guests,
                paymentStatus: 'paid',
                stripeSessionId: session.id
            });
        }

        response.json({ received: true });
    }
);

// ✅ Create Checkout Session
app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const { hotel, nights, guests, email } = req.body;
        const total = hotel.price * nights;

        const YOUR_DOMAIN =
            process.env.NODE_ENV === "production"
                ? "https://diasporastay.vercel.app"
                : "http://localhost:5173";

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
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

        // Store pending booking
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
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

// ✅ Stripe Webhook (raw body)
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

        // Handle successful payment
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            console.log("✅ Payment success:", session.id);

            // Update booking record
            await Booking.findOneAndUpdate(
                { stripeSessionId: session.id },
                { status: "paid" }
            );
        }

        res.json({ received: true });
    }
);

// ✅ Get bookings by email
app.get("/api/bookings", async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json({ error: "Email required" });

        const bookings = await Booking.find({ email }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

app.get("/", (req, res) => res.send("DiasporaStay backend with Stripe Webhooks ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
