import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import 'animate.css';

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

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

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Try again.');
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 animate__animated animate__fadeIn">
            <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: '100%' }}>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <h2 className="text-center mb-4 text-primary fw-bold d-flex align-items-center justify-content-center gap-2">
                        <FaUserPlus /> Register
                    </h2>

                    {error && (
                        <div className="alert alert-danger animate__animated animate__fadeInDown mb-3 py-2">
                            {error}
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label fw-semibold">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className="form-control"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        />
                    </div>

                    <div className="mb-3">
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

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                        type="submit"
                        disabled={loading}
                    >
                        {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                        Register
                    </button>

                    <div className="text-center mt-3">
                        <span className="text-secondary">Already have an account?</span>{' '}
                        <Link to="/login" className="text-primary fw-semibold text-decoration-none">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
