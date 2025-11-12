import React from "react";
import OwnerDashboard from "./OwnerDashboard";
import { Routes, Route } from "react-router-dom";
import DSNavbar from "./components/DSNavbar";
import DSFooter from "./components/DSFooter";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Hotel from "./pages/Hotel";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import MyBookings from "./pages/MyBookings";
import OwnerLogin from "./pages/OwnerLogin";
import GuestLogin from "./pages/GuestLogin";


export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <DSNavbar />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/hotel/:id" element={<Hotel />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/guest-login" element={<GuestLogin />} />



          {/* 🧾 Hotel owner Stripe onboarding portal */}
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route
            path="/owner/onboarding/success"
            element={
              <div style={{ padding: "60px", textAlign: "center" }}>
                <h1>🎉 Stripe Onboarding Successful</h1>
                <p>
                  Your Stripe Express account has been connected successfully.
                  You can now receive payouts for your hotel bookings.
                </p>
                <a
                  href="/owner"
                  style={{
                    background: "#635BFF",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textDecoration: "none",
                  }}
                >
                  Back to Owner Dashboard
                </a>
              </div>
            }
          />
          <Route
            path="/owner/onboarding/refresh"
            element={
              <div style={{ padding: "60px", textAlign: "center" }}>
                <h1>🔄 Stripe Onboarding Incomplete</h1>
                <p>
                  It looks like your Stripe onboarding wasn’t completed. Please
                  try again using the link below.
                </p>
                <a
                  href="/owner"
                  style={{
                    background: "#dc3545",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textDecoration: "none",
                  }}
                >
                  Retry Onboarding
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      <DSFooter />
    </div>
  );
}
