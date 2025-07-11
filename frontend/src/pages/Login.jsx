import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import 'animate.css';
 import logo from '../assets/logo.png'; // Uncomment if you have a logo

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Try again.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-success bg-opacity-10 animate__animated animate__fadeIn">
            <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: '100%' }}>
                {/* Optional: Logo/Branding */}
                {/* <div className="text-center mb-3">
                    <img src={logo} alt="Food Expiry Tracker" style={{ width: 60 }} />
                </div> */}
                <form onSubmit={handleSubmit} autoComplete="off">
                    <h2 className="text-center mb-4 text-success fw-bold d-flex align-items-center justify-content-center gap-2">
                        <FaSignInAlt /> Login
                    </h2>
                    {error && (
                        <div className="alert alert-danger animate__animated animate__fadeInDown mb-3 py-2">
                            {error}
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="password" className="form-label fw-semibold">Password</label>
                        <div className="input-group">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                tabIndex={-1}
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4 text-end">
                        <Link to="/forgot-password" className="text-decoration-none small text-primary">
                            Forgot password?
                        </Link>
                    </div>
                    <button className="btn btn-success w-100 fw-semibold d-flex align-items-center justify-content-center gap-2" type="submit" disabled={loading}>
                        {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                        Login
                    </button>
                    <div className="text-center mt-3">
                        <span className="text-secondary">Don't have an account?</span>{' '}
                        <Link to="/register" className="text-primary fw-semibold text-decoration-none">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
