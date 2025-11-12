import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        stripeAccountId: { type: String },
        stripeVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Owner", ownerSchema);
