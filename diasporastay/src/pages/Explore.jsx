import { useState } from "react";
import { HOTELS } from "../data/hotels";

export default function Explore() {
    const [selectedCountry, setSelectedCountry] = useState("");

    // Get unique country list dynamically
    const countries = [...new Set(HOTELS.map(h => h.country))];

    // Filtered hotel list
    const filteredHotels = selectedCountry
        ? HOTELS.filter(h => h.country === selectedCountry)
        : HOTELS;

    return (
        <div className="container py-5">
            <h2 className="fw-bold text-center mb-4">Explore Stays</h2>

            {/* Filter dropdown */}
            <div className="d-flex justify-content-center mb-4">
                <select
                    className="form-select w-auto"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                >
                    <option value="">🌍 All Countries</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>

            {/* Hotel list */}
            <div className="row">
                {filteredHotels.map((hotel) => (
                    <div className="col-md-4 mb-4" key={hotel.id}>
                        <div className="card shadow-sm h-100 border-0">
                            <img
                                src={hotel.image}
                                className="card-img-top"
                                alt={hotel.name}
                                style={{ height: "220px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title fw-bold">{hotel.name}</h5>
                                <p className="text-muted mb-1">
                                    {hotel.city}, {hotel.country} {hotel.flag}
                                </p>
                                <p className="fw-semibold text-primary">
                                    ${hotel.price} / night
                                </p>
                                <a
                                    href={`/hotel/${hotel.id}`}
                                    className="btn btn-outline-primary w-100"
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No results message */}
            {filteredHotels.length === 0 && (
                <p className="text-center text-muted mt-4">
                    No hotels found for this country.
                </p>
            )}
        </div>
    );
}
