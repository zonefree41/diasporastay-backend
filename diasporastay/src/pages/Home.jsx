import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section
                className="d-flex align-items-center text-center text-white"
                style={{
                    background:
                        "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1576675784211-0b90e8a82ec3?q=80&w=1800') center/cover no-repeat",
                    minHeight: "90vh",
                }}
            >
                <div className="container">
                    <h1 className="display-3 fw-bold mb-3">
                        Discover Home Wherever You Go
                    </h1>
                    <p className="lead mb-4">
                        Book authentic stays across Africa & the diaspora — built for
                        global travelers like you.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link
                            to="/explore"
                            className="btn btn-primary btn-lg px-4 py-2 shadow"
                        >
                            Explore Stays
                        </Link>
                        <a href="#how" className="btn btn-outline-light btn-lg px-4 py-2">
                            How It Works
                        </a>
                    </div>
                </div>

            </section>

            {/* How It Works */}
            <section id="how" className="py-5 bg-white text-center">
                <div className="container">
                    <h2 className="fw-bold mb-5">How It Works</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <i className="bi bi-search display-5 text-primary"></i>
                            <h5 className="mt-3">1. Browse</h5>
                            <p className="text-muted">
                                Search curated hotels with verified reviews and modern amenities.
                            </p>
                        </div>
                        <div className="col-md-4">
                            <i className="bi bi-credit-card display-5 text-primary"></i>
                            <h5 className="mt-3">2. Book</h5>
                            <p className="text-muted">
                                Secure and instant checkout powered by Stripe — no hidden fees.
                            </p>
                        </div>
                        <div className="col-md-4">
                            <i className="bi bi-suitcase2 display-5 text-primary"></i>
                            <h5 className="mt-3">3. Enjoy</h5>
                            <p className="text-muted">
                                Experience authentic hospitality and local culture with ease.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Destinations */}
            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="fw-bold mb-5">Popular Destinations</h2>
                    <div className="row g-4">
                        {[
                            {
                                city: "Accra",
                                country: "Ghana",
                                image:
                                    "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1400",
                            },
                            {
                                city: "Nairobi",
                                country: "Kenya",
                                image:
                                    "https://images.unsplash.com/photo-1597750451743-9d5f8916a27f?q=80&w=1400",
                            },
                            {
                                city: "Lagos",
                                country: "Nigeria",
                                image:
                                    "https://images.unsplash.com/photo-1600786980022-e1578e7c5a3c?q=80&w=1400",
                            },
                            {
                                city: "Cape Town",
                                country: "South Africa",
                                image:
                                    "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=1400",
                            },
                        ].map((dest, i) => (
                            <div key={i} className="col-md-3">
                                <div className="card shadow-sm border-0">
                                    <img
                                        src={dest.image}
                                        className="card-img-top"
                                        alt={dest.city}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title mb-1">{dest.city}</h5>
                                        <p className="text-muted">{dest.country}</p>
                                        <Link
                                            to="/explore"
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            Explore
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
