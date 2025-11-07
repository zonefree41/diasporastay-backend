import { useParams, Link } from "react-router-dom"
import { HOTELS } from "../data/hotels"
import axios from "axios"

export default function Hotel() {
    const { id } = useParams()
    const hotel = HOTELS.find((h) => h.id === parseInt(id))

    if (!hotel) {
        return (
            <div className="container text-center py-5">
                <h2 className="text-danger">Hotel not found</h2>
                <Link to="/explore" className="btn btn-outline-primary mt-3">
                    Back to Explore
                </Link>
            </div>
        )
    }

    // ⚙️ Handle Stripe Checkout
    const handleCheckout = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/create-checkout-session", {
                hotel,
                nights: 2,
                guests: 2,
            })
            window.location.href = res.data.url
        } catch (err) {
            alert("Payment failed: " + err.message)
        }
    }

    return (
        <div className="hotel-page">
            {/* ✅ Hero / Banner */}
            <section
                className="hotel-banner text-white d-flex align-items-center"
                style={{
                    background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${hotel.image}) center/cover no-repeat`,
                    height: "55vh",
                }}
            >
                <div className="container text-center">
                    <h1 className="fw-bold mb-3">{hotel.name}</h1>
                    <p className="lead mb-0">
                        📍 {hotel.city}, {hotel.country} {hotel.flag}
                    </p>
                </div>
            </section>

            {/* ✅ Main Content */}
            <div className="container py-5">
                <div className="row g-4">
                    {/* Left Side – Description */}
                    <div className="col-lg-8">
                        <h4 className="fw-bold mb-3">About this stay</h4>
                        <p className="text-muted mb-4">{hotel.description}</p>

                        <h5 className="fw-bold mt-4 mb-3">Amenities</h5>
                        <div className="row row-cols-2 g-3 text-muted">
                            <div className="col"><i className="bi bi-wifi me-2 text-primary"></i>Free Wi-Fi</div>
                            <div className="col"><i className="bi bi-cup-hot me-2 text-primary"></i>Breakfast included</div>
                            <div className="col"><i className="bi bi-car-front me-2 text-primary"></i>Airport pickup</div>
                            <div className="col"><i className="bi bi-person-workspace me-2 text-primary"></i>Business center</div>
                            <div className="col"><i className="bi bi-droplet-half me-2 text-primary"></i>Pool access</div>
                            <div className="col"><i className="bi bi-door-open me-2 text-primary"></i>24-hour front desk</div>
                        </div>

                        <Link to="/explore" className="btn btn-outline-secondary mt-4">
                            ← Back to Explore
                        </Link>
                    </div>

                    {/* Right Side – Booking Card */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
                            <div className="card-body text-center">
                                <h4 className="fw-bold mb-3 text-primary">
                                    ${hotel.price} <small className="text-muted fs-6">/ night</small>
                                </h4>
                                <p className="text-muted mb-3">Includes all taxes & fees</p>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Guests</label>
                                    <select className="form-select text-center">
                                        <option>1 Guest</option>
                                        <option>2 Guests</option>
                                        <option>3 Guests</option>
                                        <option>4 Guests</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="btn btn-primary w-100 py-2"
                                >
                                    Reserve Now
                                </button>

                                <p className="text-muted mt-3" style={{ fontSize: "0.9rem" }}>
                                    Secure payment via Stripe 💳
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
