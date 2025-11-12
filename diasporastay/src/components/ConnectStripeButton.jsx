// src/components/ConnectStripeButton.jsx
import React, { useState } from "react";

export default function ConnectStripeButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleConnect = async () => {
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:5000/api/stripe/connect-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    country: "GH", // or dynamic country code: GH, KE, NG, ZA
                    email: "owner@example.com",
                }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe onboarding
            } else {
                setMessage(data.error || "Something went wrong");
            }
        } catch (err) {
            setMessage("Error connecting Stripe: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h3>Connect your Stripe account</h3>
            <p>
                Once connected, you’ll receive guest payments automatically to your
                Stripe account.
            </p>
            <button
                onClick={handleConnect}
                disabled={loading}
                style={{
                    background: "#635BFF",
                    color: "white",
                    border: "none",
                    padding: "12px 25px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                }}
            >
                {loading ? "Connecting..." : "Connect with Stripe"}
            </button>
            {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}
        </div>
    );
}
