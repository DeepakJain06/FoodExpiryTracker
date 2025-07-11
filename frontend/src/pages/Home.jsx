import { useEffect, useState } from 'react';
import { FaCarrot } from 'react-icons/fa';
import 'animate.css';

export default function Home() {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        const fetchFoods = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:5000/api/foods', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setFoods(data);
                }
            } catch (err) {
                // Handle error
            }
        };
        fetchFoods();
    }, []);

    const getDaysLeft = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getProgressVariant = (daysLeft) => {
        if (daysLeft <= 2) return 'danger';
        if (daysLeft <= 5) return 'warning';
        return 'success';
    };

    return (
        <div className="container py-5 animate__animated animate__fadeIn">
            <div className="mx-auto" style={{ maxWidth: '800px' }}>
                <div className="d-flex align-items-center mb-4">
                    <FaCarrot className="me-3 display-5 text-warning" />
                    <h1 className="display-6 fw-bold text-success mb-0">
                        Food Expiry Tracker
                    </h1>
                </div>
                <div className="mb-4">
                    <p className="lead text-secondary">
                        Track your food items and never let them go to waste! Add, view, and manage your food inventory with real-time expiry tracking.
                    </p>
                </div>
                {foods.length === 0 ? (
                    <div className="alert alert-info shadow-sm">
                        <strong>No food items added yet.</strong> Start by adding your first item!
                    </div>
                ) : (
                    <div className="row g-4">
                        {foods.map((food) => {
                            const daysLeft = getDaysLeft(food.expiryDate);
                            const progress = Math.max(0, Math.min(100, Math.round((daysLeft / 30) * 100)));
                            const progressVariant = getProgressVariant(daysLeft);

                            return (
                                <div className="col-md-6" key={food._id}>
                                    <div className={`card shadow h-100 border-${progressVariant} border-3 animate__animated animate__fadeInUp`}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h5 className="card-title mb-0 text-success">{food.name}</h5>
                                                <span className={`badge bg-${progressVariant} fs-6`}>
                                                    {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                                                </span>
                                            </div>
                                            <p className="card-text text-muted mb-2">
                                                Quantity: <span className="fw-semibold">{food.quantity}</span>
                                            </p>
                                            <p className="card-text small mb-3">
                                                <span className="fw-medium">Expires on:</span>{' '}
                                                {new Date(food.expiryDate).toLocaleDateString()}
                                            </p>
                                            <div className="progress" style={{ height: '8px' }}>
                                                <div
                                                    className={`progress-bar bg-${progressVariant}`}
                                                    role="progressbar"
                                                    style={{ width: `${progress}%` }}
                                                    aria-valuenow={progress}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
