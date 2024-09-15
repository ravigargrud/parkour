import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from "../../store/user-context";
import Swal from 'sweetalert2';
import axios from 'axios';

const DashBoard = () => {
    const {
        user,
        location,
        locationInfo,
        error,
        isLoading,
        setUser,
    } = useContext(UserContext);

    const navigate = useNavigate();

    const [userHistory, setUserHistory] = useState([]);

    const handleSignOut = async () => {
        // Show confirmation alert before signing out
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to sign out of your account?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, sign out!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            // Clear user data from context
            setUser(null);

            // Optionally clear user data from local storage or other storage
            localStorage.removeItem('user');

            // Show sign-out success notification
            Swal.fire({
                icon: 'success',
                title: 'Signed out',
                text: 'You have successfully signed out.',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });

            // Redirect to login page
            navigate('/auth/login', { replace: true });
        }
    };

    useEffect(() => {
        const fetchUserHistory = async () => {
            const response = await axios.get(`http://localhost:8000/parking/get-parking-history/${user.id}`);
            setUserHistory(response.data);
        }

        fetchUserHistory();
    }, [user]);

    if (isLoading) {
        return <div className="p-4 mt-[85px] text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 mt-[85px] text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="max-w-[90%] mx-auto py-8 mt-[85px] h-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">User Details</h2>
                {user ? (
                    <div>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        {/* Add other user details as necessary */}
                    </div>
                ) : (
                    <p>No user details available.</p>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Location Information</h2>
                {locationInfo ? (
                    <div>
                        <p><strong>Address:</strong> {locationInfo.display_name}</p>
                        {/* Add other location info details as needed */}
                    </div>
                ) : (
                    <p>No location information available.</p>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                {location ? (
                    <div>
                        <p><strong>Latitude:</strong> {location.latitude}</p>
                        <p><strong>Longitude:</strong> {location.longitude}</p>
                    </div>
                ) : (
                    <p>Location data not available.</p>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Parking History</h2>
                {userHistory.length > 0 ? (
                    userHistory.map((history) => (
                        <div key={history.id} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                            <div className="flex flex-col gap-2">
                                <p><strong>User ID:</strong> {history.user_id}</p>
                                <p><strong>Parking Lot ID:</strong> {history.parking_lot_id}</p>
                                <p><strong>Entry Time:</strong> {history.entry_time}</p>
                                <p><strong>Exit Time:</strong> {history.exit_time}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No parking history available.</p>
                )}
            </div>

            <button
                onClick={handleSignOut}
                className="text-white bg-red-500 py-2 px-6 rounded-lg mx-auto block mt-8 hover:bg-red-600 transition-colors"
            >
                Sign Out
            </button>
        </div>
    );
};

export default DashBoard;
