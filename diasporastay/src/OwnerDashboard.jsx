import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function OwnerDashboard() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [totals, setTotals] = useState({ total: 0, paid: 0, commission: 0 });
    const email = "owner@example.com"; // 🔧 Replace later with logged-in owner email

    // ✅ Connect Stripe Account
    const connectStripe = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/stripe/connect-account`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url; // ✅ redirect to Stripe onboarding
            } else {
                alert(data.error || "Failed to create Stripe onboarding link.");
            }
        } catch (err) {
            console.error("Stripe connect error:", err);
            alert("Unable to connect to Stripe. Check backend logs.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Check Stripe account verification status
    const checkStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/owner/verify/${email}`);
            if (!res.ok) throw new Error("Network error");
            const data = await res.json();
            setStatus(data);
        } catch (err) {
            console.error("Error verifying Stripe:", err);
            alert("Error checking Stripe status. Please try again.");
        }
    };

    // ✅ Load hotel bookings
    const loadEarnings = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/owner/bookings/${email}`);
            const data = await res.json();
            setBookings(data);

            const paidBookings = data.filter((b) => b.transferStatus === "sent");
            const totalPaid = paidBookings.reduce((sum, b) => sum + b.total, 0);
            const commission = totalPaid * 0.15;

            setTotals({
                total: data.reduce((sum, b) => sum + b.total, 0),
                paid: totalPaid,
                commission,
            });
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };

    useEffect(() => {
        loadEarnings();
    }, []);

    return (
        <div
            style={{
                background: "#f8f9fa",
                minHeight: "100vh",
                padding: "40px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                🏨 Hotel Owner Dashboard
            </h1>

            {/* Stripe Setup Section */}
            <div
                style={{
                    background: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    maxWidth: "600px",
                    margin: "0 auto 30px auto",
                    textAlign: "center",
                }}
            >
                <h3>💳 Stripe Account Setup</h3>
                {!status?.stripeVerified ? (
                    <>
                        <p style={{ marginTop: "10px" }}>
                            Connect your Stripe Express account to start receiving payouts.
                        </p>
                        <button
                            onClick={connectStripe}
                            disabled={loading}
                            style={{
                                background: "#635BFF",
                                color: "white",
                                padding: "12px 24px",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                marginTop: "10px",
                            }}
                        >
                            {loading ? "Redirecting..." : "Connect with Stripe"}
                        </button>
                    </>
                ) : (
                    <p style={{ color: "green", marginTop: "10px" }}>
                        ✅ Stripe Account Connected
                    </p>
                )}

                <hr style={{ margin: "20px 0" }} />

                <button
                    onClick={checkStatus}
                    style={{
                        background: "#198754",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    Check Stripe Status
                </button>

                {status && (
                    <div style={{ marginTop: "15px" }}>
                        <p>
                            <strong>Email:</strong> {status.email}
                        </p>
                        <p>
                            <strong>Account ID:</strong> {status.stripeAccountId}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            {status.stripeVerified ? (
                                <span style={{ color: "green" }}>✅ Verified</span>
                            ) : (
                                <span style={{ color: "red" }}>❌ Not Verified</span>
                            )}
                        </p>
                    </div>
                )}
            </div>

            {/* Earnings Summary */}
            <div
                style={{
                    background: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    maxWidth: "800px",
                    margin: "0 auto 30px auto",
                }}
            >
                <h3 style={{ textAlign: "center" }}>💰 Earnings Summary</h3>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        marginTop: "20px",
                    }}
                >
                    <div>
                        <h4>Total Bookings</h4>
                        <p>${totals.total.toFixed(2)}</p>
                    </div>
                    <div>
                        <h4>Paid Out</h4>
                        <p style={{ color: "green" }}>${totals.paid.toFixed(2)}</p>
                    </div>
                    <div>
                        <h4>Your Commission (15%)</h4>
                        <p style={{ color: "red" }}>${totals.commission.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Booking History */}
            <div
                style={{
                    background: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    maxWidth: "900px",
                    margin: "0 auto",
                }}
            >
                <h3 style={{ textAlign: "center" }}>📋 Booking History</h3>
                <button
                    onClick={loadEarnings}
                    style={{
                        background: "#0d6efd",
                        color: "white",
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "block",
                        margin: "10px auto 20px auto",
                    }}
                >
                    Refresh Bookings
                </button>

                {bookings.length === 0 ? (
                    <p style={{ textAlign: "center", color: "gray" }}>No bookings yet.</p>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "10px",
                        }}
                    >
                        <thead>
                            <tr style={{ background: "#eee", textAlign: "left" }}>
                                <th style={{ padding: "10px" }}>Hotel</th>
                                <th>Total ($)</th>
                                <th>Status</th>
                                <th>Payout</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b._id} style={{ borderBottom: "1px solid #ccc" }}>
                                    <td style={{ padding: "8px" }}>{b.hotelName}</td>
                                    <td>{b.total}</td>
                                    <td>{b.status}</td>
                                    <td>
                                        {b.transferStatus === "sent" ? (
                                            <span style={{ color: "green" }}>✅ Paid</span>
                                        ) : (
                                            <span style={{ color: "orange" }}>⏳ Pending</span>
                                        )}
                                    </td>
                                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
