import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:5000/api/auth/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUser(response.data.user);

            } catch (error) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        getProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!user) {
        return (
            <div className="auth-page">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <nav className="navbar">
                <div className="navbar-title">
                    Citizen Service Portal
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </nav>

            <main className="dashboard-content">

                <div className="welcome-card">
                    <h1>Welcome, {user.name} 👋</h1>

                    <p>
                        Welcome to your citizen service dashboard.
                    </p>

                    <p>
                        From here you will be able to submit,
                        track and manage government service complaints.
                    </p>
                </div>

                <div className="info-grid">

                    <div className="info-card">
                        <h3>EMAIL ADDRESS</h3>
                        <p>{user.email}</p>
                    </div>

                    <div className="info-card">
                        <h3>ACCOUNT TYPE</h3>
                        <p>{user.role}</p>
                    </div>

                    <div className="info-card">
                        <h3>COMPLAINTS</h3>
                        <p>Coming soon</p>
                    </div>

                    <div className="info-card">
                        <h3>SERVICE REQUESTS</h3>
                        <p>Coming soon</p>
                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;