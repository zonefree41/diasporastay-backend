import { Link } from "react-router-dom"

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className="hero d-flex align-items-center text-center text-white" style={{
                background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1558980664-10b2a7b5e90b?q=80&w=1600') center/cover no-repeat",
                minHeight: "85vh"
            }}>
                <div className="container">
                    <h1 className="display-3 fw-bold mb-3">Discover Home Wherever You Go</h1>
                    <p className="lead mb-4">Book authentic stays across Africa & the diaspora — built for global travelers like you.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/explore" className="btn btn-primary btn-lg px-4 py-2 shadow">Explore Stays</Link>
                        <a href="#how" className="btn btn-outline-light btn-lg px-4 py-2">How It Works</a>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how" className="py-5 bg-white">
                <div className="container text-center">
                    <h2 className="fw-bold mb-5">How It Works</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <i className="bi bi-search display-5 text-primary"></i>
                            <h5 className="mt-3">1. Browse</h5>
                            <p className="text-muted">Search curated hotels with verified reviews and amenities.</p>
                        </div>
                        <div className="col-md-4">
                            <i className="bi bi-credit-card display-5 text-primary"></i>
                            <h5 className="mt-3">2. Book</h5>
                            <p className="text-muted">Instant, secure Stripe checkout — no hidden fees.</p>
                        </div>
                        <div className="col-md-4">
                            <i className="bi bi-suitcase2 display-5 text-primary"></i>
                            <h5 className="mt-3">3. Enjoy</h5>
                            <p className="text-muted">Experience authentic hospitality with diaspora-friendly hosts.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
