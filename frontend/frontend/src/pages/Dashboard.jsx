import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import NotificationToggle from '../components/NotificationToggle';

export default function Dashboard() {
    const [foods, setFoods] = useState([]);
    const [filter, setFilter] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', quantity: '', expiryDate: '' });
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/foods', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setFoods(data);
        } catch (err) {
            toast.error('Failed to fetch food items');
            console.error(err);
        }
    };

    const getFilteredFoods = () => {
        const today = new Date();
        const soon = new Date();
        soon.setDate(today.getDate() + 3);

        return foods.filter(food => {
            const expiry = new Date(food.expiryDate);
            if (filter === 'expiring') return expiry >= today && expiry <= soon;
            if (filter === 'expired') return expiry < today;
            return true;
        });
    };

    const isExpiringSoon = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diff = (expiry - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 3;
    };

    const getProgressVariant = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        if (diff <= 0) return 'bg-danger';
        if (diff <= 3) return 'bg-warning';
        return 'bg-success';
    };

    const getProgress = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return Math.max(0, Math.min(100, Math.round((diff / 30) * 100)));
    };

    const handleEditClick = (food) => {
        setEditingId(food._id);
        setEditData({
            name: food.name,
            quantity: food.quantity,
            expiryDate: food.expiryDate.slice(0, 10),
        });
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/foods/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editData),
            });

            if (res.ok) {
                toast.success('Food item updated successfully');
                await fetchFoods();
                setEditingId(null);
                setEditData({ name: '', quantity: '', expiryDate: '' });
            } else {
                toast.error('Failed to update food item');
            }
        } catch (err) {
            toast.error('Error updating food item');
            console.error(err);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/foods/${deleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                toast.success('Food item deleted');
                await fetchFoods();
            } else {
                toast.error('Failed to delete food item');
            }
        } catch (err) {
            toast.error('Error deleting food item');
            console.error(err);
        }
        setShowModal(false);
        setDeleteId(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const handleAddFood = () => {
        navigate('/add-food');
    };

    const filteredFoods = getFilteredFoods();

    return (
        <div className="container py-4 animate__animated animate__fadeIn">
            <ToastContainer position="top-right" autoClose={2500} />
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                <h2 className="display-6 fw-bold text-success mb-0">🍱 Your Food Items</h2>
                <NotificationToggle />
                <div>
                    <button
                        onClick={handleAddFood}
                        className="btn btn-success me-2 shadow"
                    >
                        <i className="bi bi-plus-circle me-1"></i> Add Food
                    </button>

                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger shadow"
                    >
                        <i className="bi bi-box-arrow-right me-1"></i> Logout
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <div className="btn-group" role="group">
                    <button
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`btn ${filter === 'expiring' ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => setFilter('expiring')}
                    >
                        Expiring Soon
                    </button>
                    <button
                        className={`btn ${filter === 'expired' ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => setFilter('expired')}
                    >
                        Expired
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {filteredFoods.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info shadow-sm text-center">
                            <strong>No food items found for this filter.</strong>
                        </div>
                    </div>
                ) : (
                    filteredFoods.map((food) => (
                        <div className="col-md-6 col-lg-4" key={food._id}>
                            <div className={`card shadow h-100 border-3 animate__animated animate__fadeInUp ${isExpiringSoon(food.expiryDate) ? 'border-warning' : 'border-success'}`}>
                                <div className="card-body">
                                    {editingId === food._id ? (
                                        <div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editData.name}
                                                onChange={handleEditChange}
                                                placeholder="Name"
                                                className="form-control mb-2"
                                            />
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={editData.quantity}
                                                onChange={handleEditChange}
                                                placeholder="Quantity"
                                                className="form-control mb-2"
                                            />
                                            <input
                                                type="date"
                                                name="expiryDate"
                                                value={editData.expiryDate}
                                                onChange={handleEditChange}
                                                className="form-control mb-3"
                                            />
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={handleUpdate}
                                                    className="btn btn-success btn-sm"
                                                >
                                                    💾 Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    ❌ Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h5 className="card-title mb-0 text-success">{food.name}</h5>
                                                <span className={`badge ${isExpiringSoon(food.expiryDate) ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                    {(() => {
                                                        const today = new Date();
                                                        const expiry = new Date(food.expiryDate);
                                                        const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                                                        return diff > 0 ? `${diff} days left` : 'Expired';
                                                    })()}
                                                </span>
                                            </div>
                                            <p className="card-text text-muted mb-2">
                                                Quantity: <span className="fw-semibold">{food.quantity}</span>
                                            </p>
                                            <p className="card-text small mb-3">
                                                <span className="fw-medium">Expires on:</span>{' '}
                                                {new Date(food.expiryDate).toLocaleDateString()}
                                            </p>
                                            <div className="progress mb-3" style={{ height: '8px' }}>
                                                <div
                                                    className={`progress-bar ${getProgressVariant(food.expiryDate)}`}
                                                    role="progressbar"
                                                    style={{ width: `${getProgress(food.expiryDate)}%` }}
                                                    aria-valuenow={getProgress(food.expiryDate)}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={() => handleEditClick(food)}
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(food._id)}
                                                    className="btn btn-outline-danger btn-sm"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content animate__animated animate__zoomIn">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this food item?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
