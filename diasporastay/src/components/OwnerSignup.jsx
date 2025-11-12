import React, { useState } from "react";

function OwnerSignup() {
    const [country, setCountry] = useState("");
    const [gateways, setGateways] = useState([]);

    const handleCountryChange = async (e) => {
        const selected = e.target.value;
        setCountry(selected);

        const res = await fetch(`http://localhost:5000/api/gateway/${selected}`);
        const data = await res.json();
        setGateways(data.gateways);
    };

    console.log("✅ PaymentGatewaySelector rendered");


    return (
        <div className="signup-form">
            <h2>List Your Hotel</h2>
            <label>Country:</label>
            <select onChange={handleCountryChange} value={country}>
                <option value="">Select country</option>
                {[
                    "Nigeria", "Ghana", "Kenya", "South Africa", "Côte d’Ivoire",
                    "Uganda", "Tanzania", "Rwanda", "Zambia", "Ethiopia",
                    "Cameroon", "Senegal", "Malawi"
                ].map((c) => (
                    <option key={c}>{c}</option>
                ))}
            </select>

            {country && (
                <div className="gateway-suggestions">
                    <h4>Recommended Payment Gateways:</h4>
                    {gateways.length > 0 ? (
                        <ul>
                            {gateways.map((g) => <li key={g}>{g}</li>)}
                        </ul>
                    ) : (
                        <p>No gateway found — use manual bank transfer.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default OwnerSignup;
