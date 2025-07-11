import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
            <div className="container">
                {/* Logo/Brand */}
                <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" to="/">
                    🍱 <span className="d-none d-sm-inline">Food Tracker</span>
                </Link>
                {/* Mobile Toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    aria-label="Toggle navigation"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
                {/* Links */}
                <div className={`collapse navbar-collapse${isOpen ? ' show' : ''}`}>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/add" onClick={() => setIsOpen(false)}>
                                Add Food
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button
                                className="btn btn-danger ms-lg-3"
                                onClick={() => {
                                    setIsOpen(false);
                                    handleLogout();
                                }}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
