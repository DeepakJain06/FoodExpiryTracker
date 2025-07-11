import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'animate.css';

export default function AddFood() {
    const [form, setForm] = useState({ name: '', quantity: '', expiryDate: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Session expired. Please log in again.');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/foods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Food item added!');
                navigate('/dashboard');
            } else {
                toast.error(data.message || 'Failed to add food');
            }
        } catch (err) {
            toast.error('Server error');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-info bg-opacity-10 animate__animated animate__fadeIn">
            <div className="card shadow-lg p-4" style={{ maxWidth: 500, width: '100%' }}>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <h2 className="text-center mb-4 text-info fw-bold d-flex align-items-center justify-content-center gap-2">
                        <FaPlusCircle /> Add Food
                    </h2>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Food Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Milk"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            className="form-control"
                            value={form.quantity}
                            onChange={handleChange}
                            required
                            min="1"
                            placeholder="e.g. 2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            className="form-control"
                            value={form.expiryDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className="btn btn-info w-100 fw-semibold d-flex align-items-center justify-content-center gap-2" type="submit" disabled={loading}>
                        {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                        Add Food
                    </button>
                </form>
            </div>
        </div>
    );
}
