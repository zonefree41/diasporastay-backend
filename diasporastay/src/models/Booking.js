import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        hotelId: String,
        hotelName: String,
        city: String,
        country: String,
        guests: Number,
        nights: Number,
        total: Number,
        email: String, // guest email
        stripeSessionId: String,
        status: { type: String, default: "pending" },
        ownerEmail: String,
        ownerStripeId: String,
        transferStatus: { type: String, default: "not_sent" },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
