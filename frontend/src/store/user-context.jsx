import React, { createContext, useState, useEffect } from "react";

// Define the context
const UserContext = createContext({
    details: {},
    location: null,
    error: null,
    isLoading: true,
    user: null,
});

export function UserContextProvider({ children }) {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [user, setUser] = useState(null);

    // Storing the user on login

    // Fetch user location
    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
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
    }, []);

    const userValue = {
        details: {}, // Add any details you want here
        location,
        error,
        isLoading,
        user
    };

    return (
        <UserContext.Provider value={userValue}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;
