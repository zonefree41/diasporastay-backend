import React from "react";
import { useSearchParams } from "react-router-dom";

export default function OnboardingSuccessPage() {
    const [params] = useSearchParams();
    const verified = params.get("verified") === "true";

    return (
        <div style={{ padding: "60px", textAlign: "center" }}>
            {verified ? (
                <>
                    <h1>🎉 Stripe Onboarding Successful</h1>
                    <p>Your Stripe Express account has been verified and is ready to receive payouts.</p>
                </>
            ) : (
                <>
                    <h1>⚠️ Onboarding Incomplete</h1>
                    <p>We couldn’t confirm your Stripe account yet. Please log in to Stripe to finish setup.</p>
                </>
            )}
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
    );
}
