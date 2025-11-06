import { useState } from 'react'
import axios from 'axios'
const API = import.meta.env.VITE_API_BASE;


export default function MyBookings() {
    const [email, setEmail] = useState('')
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchBookings = async () => {
        if (!email) return alert("Please enter your booking email.")
        try {
            setLoading(true)
            const res = await axios.get(`https://diasporastay-backend.onrender.com/api/bookings?email=${email}`)
            setBookings(res.data)
        } catch (err) {
            alert("Error fetching bookings: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-center">My Bookings</h2>

            <div className="row justify-content-center mb-4">
                <div className="col-md-6 d-flex gap-2">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your booking email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={fetchBookings} disabled={loading}>
                        {loading ? "Loading..." : "Search"}
                    </button>
                </div>
            </div>

            {bookings.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {bookings.map(b => (
                        <div key={b._id} className="col">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{b.hotelName}</h5>
                                    <p className="text-muted mb-2">{b.city}, {b.country}</p>
                                    <ul className="list-unstyled small">
                                        <li><strong>Nights:</strong> {b.nights}</li>
                                        <li><strong>Guests:</strong> {b.guests}</li>
                                        <li><strong>Total:</strong> ${b.total}</li>
                                        <li><strong>Status:</strong>
                                            {" "}
                                            <span className={
                                                b.status === "paid" ? "text-success" : "text-warning"
                                            }>
                                                {b.status}
                                            </span>
                                        </li>
                                    </ul>
                                    <div className="text-end text-muted small">
                                        Booked: {new Date(b.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted mt-4">
                    {loading ? "" : "No bookings found. Try entering your email above."}
                </div>
            )}
        </div>
    )
}
