import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
fetch("http://localhost:5000/api/gateway/Nigeria")


export default function PaymentGatewaySelector() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/gateway/Nigeria")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center mt-5">Loading gateways...</p>;
    if (error) return <p className="text-center text-danger mt-5">Error: {error}</p>;
    if (!data) return <p className="text-center mt-5">No data found.</p>;

    return (
        <div style={{ background: "#f8f9fa", minHeight: "100vh", padding: "50px" }}>
            <h1 className="text-center mb-4">DiasporaStay Payment Gateways</h1>
            <Container>
                <Row className="justify-content-center">
                    {data.gateways.map((gateway) => (
                        <Col md={4} key={gateway}>
                            <Card className="text-center shadow-sm mb-4">
                                <Card.Body>
                                    <Card.Title>{gateway}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}
