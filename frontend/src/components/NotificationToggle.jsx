import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function NotificationToggle() {
    const [enabled, setEnabled] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/user/notification', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setEnabled(data.notificationEnabled);
            } else {
                toast.error(data.message || 'Error fetching notification status');
            }
        } catch (err) {
            toast.error('Failed to fetch notification status');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/user/notification', {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setEnabled(data.notificationEnabled);
                toast.success(`Notifications ${data.notificationEnabled ? 'enabled' : 'disabled'}`);
            } else {
                toast.error(data.message || 'Failed to update notification setting');
            }
        } catch (err) {
            toast.error('Server error while updating notification');
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    if (loading) return <p className="text-gray-500">Loading notification settings...</p>;

    return (
        <div className="flex items-center gap-3 mt-6">
            <span className="font-medium">Email Notifications:</span>
            <button
                onClick={toggleStatus}
                className={`px-4 py-1 rounded ${enabled ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-800'
                    }`}
            >
                {enabled ? 'Enabled' : 'Disabled'}
            </button>
        </div>
    );
}
