import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    hotelName: String,
    city: String,
    country: String,
    price: Number,
    nights: Number,
    guests: Number,
    paymentStatus: {
        type: String,
        default: 'pending'
    },
    stripeSessionId: String,
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Booking', bookingSchema)
