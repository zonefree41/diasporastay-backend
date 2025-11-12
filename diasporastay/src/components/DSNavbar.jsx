import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";

export default function DSNavbar() {
    const navigate = useNavigate();
    const [ownerEmail, setOwnerEmail] = useState(null);
    const [guestEmail, setGuestEmail] = useState(null);

    useEffect(() => {
        setOwnerEmail(localStorage.getItem("ownerEmail"));
        setGuestEmail(localStorage.getItem("guestEmail"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("ownerEmail");
        localStorage.removeItem("guestEmail");
        setOwnerEmail(null);
        setGuestEmail(null);
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold text-primary" to="/">
                    DiasporaStay
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/explore">
                                Explore
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/my-bookings">
                                My Bookings
                            </Link>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center">
                        {/* If logged in as Owner */}
                        {ownerEmail ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                    className="d-flex align-items-center"
                                >
                                    <i className="bi bi-person-circle me-2"></i>
                                    <span>Owner</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.ItemText>
                                        <small className="text-muted">{ownerEmail}</small>
                                    </Dropdown.ItemText>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={Link} to="/owner-dashboard">
                                        Dashboard
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : guestEmail ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle
                                    variant="primary"
                                    id="dropdown-basic"
                                    className="d-flex align-items-center"
                                >
                                    <i className="bi bi-person-circle me-2"></i>
                                    <span>Guest</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.ItemText>
                                        <small className="text-muted">{guestEmail}</small>
                                    </Dropdown.ItemText>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={Link} to="/my-bookings">
                                        My Bookings
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <>
                                <Link
                                    to="/guest-login"
                                    className="btn btn-outline-primary me-2 px-3"
                                >
                                    Guest Login
                                </Link>
                                <Link to="/owner-login" className="btn btn-success px-3">
                                    Owner Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
