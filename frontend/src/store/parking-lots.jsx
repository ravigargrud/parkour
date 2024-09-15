import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

// Define the context
const ParkingContext = createContext({
    nearByLocations: null,
    setNearByLocations: () => { },
});

export function ParkingContextProvider({ children }) {
    const [nearByLocations, setNearByLocations] = useState([]);

    const parkingValue = {
        nearByLocations,
        setNearByLocations,
    };

    return (
        <ParkingContext.Provider value={parkingValue}>
            {children}
        </ParkingContext.Provider>
    );
}

export default ParkingContext;
