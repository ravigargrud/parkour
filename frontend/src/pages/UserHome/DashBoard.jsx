import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import UserContext from "../../store/user-context";

const DashBoard = () => {
    const {
        user,
        location,
        locationInfo,
        error,
        isLoading,
        setUser, // Ensure that setUser is provided by UserContext
    } = useContext(UserContext);
    
    const navigate = useNavigate(); // Hook for navigation

    const handleSignOut = () => {
        // Clear user data from context
        setUser(null);

        // Optionally clear user data from local storage or other storage
        localStorage.removeItem('user');

        // Redirect to login page or home page
        navigate('/auth/login', {replace: true}); // Adjust the path as needed
    };

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

            <button
                onClick={handleSignOut}
                className="text-white bg-red-500 py-2 px-6 rounded-lg mx-auto block mt-8"
            >
                Sign Out
            </button>
        </div>
    );
};

export default DashBoard;
