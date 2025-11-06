export default function Success() {
    return (
        <div className="container py-5 text-center">
            <h1 className="text-success">✅ Payment Successful!</h1>
            <p>Your booking has been confirmed. Check your email for details.</p>
            <a href="/" className="btn btn-outline-primary mt-3">
                Go Home
            </a>
        </div>
    );
}

