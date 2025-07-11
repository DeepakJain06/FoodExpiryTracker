import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AddFood from './pages/AddFood';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
            <h1 className="display-4 fw-bold mb-4 text-success">Welcome to Food Expiry Tracker</h1>
            <div className="d-flex gap-3">
              <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
              <Link to="/register" className="btn btn-success btn-lg">Register</Link>
            </div>
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

