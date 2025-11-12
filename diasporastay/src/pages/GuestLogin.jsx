import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GuestLogin() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email) return alert("Please enter your email");
        localStorage.setItem("guestEmail", email);
        navigate("/my-bookings");
    };

    return (
        <div className="container py-5 text-center" style={{ maxWidth: 500 }}>
            <h2 className="fw-bold mb-3">🧳 Guest Sign In</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className="btn btn-primary w-100" type="submit">
                    Sign In
                </button>
            </form>
        </div>
    );
}
