import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

// Define the context
const UserContext = createContext({
    details: {},
    location: null,
    setLocation: () => { },
    error: null,
    isLoading: true,
    user: null,
    locationInfo: null,
    setUser: () => { },
    setLocationInfo: () => { },
});

export function UserContextProvider({ children }) {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [locationInfo, setLocationInfo] = useState({});

    // Fetch user details from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('userDetails');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Save user details to local storage whenever the user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('userDetails', JSON.stringify(user));
        }
    }, [user]);

    // Fetch user location
    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ latitude, longitude });
                        try {
                            const response = await axios.get(`https://us1.locationiq.com/v1/reverse?key=pk.ed26d957d0a42dafd8c9e8612b4de06c&lat=${latitude}&lon=${longitude}&format=json`);
                            setLocationInfo(response.data);
                        } catch (error) {
                            setError(error.message);
                        }
                        setIsLoading(false);
                    },
                    (err) => {
                        setError(err.message);
                        setIsLoading(false);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
                setIsLoading(false);
            }
        };

        getLocation();
    }, []); // Empty dependency array ensures this runs only once on mount

    const userValue = {
        details: {}, // Add any details you want here
        location,
        setLocation,
        error,
        isLoading,
        user,
        locationInfo,
        setUser,
        setLocationInfo
    };

    return (
        <UserContext.Provider value={userValue}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;
