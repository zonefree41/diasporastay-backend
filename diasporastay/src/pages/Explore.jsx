import { useState } from "react"
import { Link } from "react-router-dom"
import { HOTELS } from '../data/hotels'
import ReactCountryFlag from "react-country-flag"


const hotels = [
    {
        id: 1,
        name: "Addis Skyline Hotel",
        city: "Addis Ababa",
        country: "Ethiopia",
        flag: "🇪🇹",
        price: 120,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
    },
    {
        id: 2,
        name: "Accra Beach Resort",
        city: "Accra",
        country: "Ghana",
        flag: "🇬🇭",
        price: 150,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000",
    },
    {
        id: 3,
        name: "Nairobi Garden Suites",
        city: "Nairobi",
        country: "Kenya",
        flag: "🇰🇪",
        price: 95,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000",
    },
    {
        id: 4,
        name: "Cape Town Heritage Lodge",
        city: "Cape Town",
        country: "South Africa",
        flag: "🇿🇦",
        price: 180,
        image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1000",
    },
    {
        id: 5,
        name: "Kigali City View Hotel",
        city: "Kigali",
        country: "Rwanda",
        flag: "🇷🇼",
        price: 110,
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d7d8cd?q=80&w=1000",
    },
    {
        id: 6,
        name: "Lagos Grand Suites",
        city: "Lagos",
        country: "Nigeria",
        flag: "🇳🇬",
        price: 140,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000",
    },
]

export default function Explore() {
    const [query, setQuery] = useState("")
    const [country, setCountry] = useState("All")
    const [priceRange, setPriceRange] = useState("All")

    // Filter hotels
    const filteredHotels = hotels.filter((hotel) => {
        const matchesSearch =
            (hotel.name + hotel.city + hotel.country).toLowerCase().includes(query.toLowerCase())
        const matchesCountry = country === "All" || hotel.country === country
        const matchesPrice =
            priceRange === "All" ||
            (priceRange === "Low" && hotel.price <= 100) ||
            (priceRange === "Medium" && hotel.price > 100 && hotel.price <= 150) ||
            (priceRange === "High" && hotel.price > 150)
        return matchesSearch && matchesCountry && matchesPrice
    })

    return (
        <div className="container py-5">
            <h2 className="fw-bold text-center mb-4">Explore Diaspora Stays</h2>

            {/* Search + Filters */}
            <div className="row justify-content-center mb-5 g-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control shadow-sm"
                        placeholder="Search by city or hotel..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select shadow-sm"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        <option value="All">All Countries</option>
                        {[...new Set(hotels.map((h) => h.country))].map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select shadow-sm"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                    >
                        <option value="All">All Prices</option>
                        <option value="Low">Low (≤ $100)</option>
                        <option value="Medium">Medium ($101–$150)</option>
                        <option value="High">High ($150+)</option>
                    </select>
                </div>
            </div>

            {/* Hotel Grid */}
            <div className="row g-4">
                {filteredHotels.length > 0 ? (
                    filteredHotels.map((hotel) => (
                        <div className="col-md-6 col-lg-3" key={hotel.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <img
                                    src={hotel.image}
                                    alt={hotel.name}
                                    className="card-img-top"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title d-flex align-items-center justify-content-between">
                                        {hotel.name}
                                        <ReactCountryFlag countryCode={hotel.countryCode} svg style={{ fontSize: "1.5rem" }} />
                                    </h5>
                                    <p className="text-muted mb-1">
                                        <i className="bi bi-geo-alt text-primary me-1"></i>
                                        {hotel.city}, {hotel.country}
                                    </p>
                                    <p className="fw-bold mb-3">${hotel.price} / night</p>
                                    <Link to={`/hotel/${hotel.id}`} className="btn btn-outline-primary w-100 mb-2">
                                        View Details
                                    </Link>
                                    <Link to={`/checkout?hotel=${hotel.id}`} className="btn btn-primary w-100">
                                        Reserve
                                    </Link>

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted fs-5">No results found for your filters.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
