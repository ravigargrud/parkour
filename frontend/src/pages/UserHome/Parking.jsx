import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import Swal

import UserContext from '../../store/user-context';

// Create a Toast instance for SweetAlert2
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

const Parking = () => {
    // State to hold the parking lot details
    const [parkingLot, setParkingLot] = useState(null);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState('');

    const userCtx = useContext(UserContext);

    // Access the current URL location
    const location = useLocation();

    useEffect(() => {
        // Function to extract the id from URL search
        const extractId = (search) => {
            // Remove the leading '?' and decode the search string
            const queryString = decodeURIComponent(search.substring(1));
            return queryString; // Assuming the entire query string is the id
        };

        // Extract the id from location.search
        const id = extractId(location.search);

        if (id) {
            // Fetch parking lot data by id
            const fetchParkingLot = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/parking/get-lot-by-id/${id}`);
                    setParkingLot(response.data);
                } catch (err) {
                    setError('Failed to fetch parking data.');
                    Toast.fire({
                        icon: 'error',
                        title: 'Failed to fetch parking data.'
                    });
                    console.error(err);
                }
            };

            fetchParkingLot();
        }
    }, [location.search]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());

        // Ensure that all required fields are filled
        if (!data.entry_time || !data.exit_time) {
            setFormError('Both timings are required.');
            Toast.fire({
                icon: 'error',
                title: 'Both timings are required.'
            });
            return;
        }

        try {
            // Add user ID and parking lot ID to the form data
            const postData = { ...data, user_id: userCtx.user.id, parking_lot_id: parkingLot.id };

            await axios.post('http://localhost:8000/parking/create-parking-history', postData);

            // Optionally clear the form or show a success message here
            setFormError('');
            Toast.fire({
                icon: 'success',
                title: 'Booking successful!'
            });
        } catch (err) {
            setFormError('Failed to create parking history.');
            Toast.fire({
                icon: 'error',
                title: 'Failed to create parking history.'
            });
            console.error(err);
        }
    };

    return (
        <div className='mt-[85px] p-4'>
            <h1 className='text-2xl font-bold mb-4 text-center'>Parking Details</h1>
            {error && <p className='text-red-500 mb-4'>{error}</p>}
            {parkingLot ? (
                <div className='bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto'>
                    <h2 className='text-xl font-semibold mb-4'>Parking Lot Details:</h2>
                    <div className='mb-4'>
                        <p className='text-gray-700 font-medium'>ID:</p>
                        <p className='text-gray-900'>{parkingLot.id}</p>
                    </div>
                    <div className='mb-4'>
                        <p className='text-gray-700 font-medium'>Address:</p>
                        <p className='text-gray-900'>{parkingLot.address || "No Address"}</p>
                    </div>
                    <div className='mb-4'>
                        <p className='text-gray-700 font-medium'>Latitude:</p>
                        <p className='text-gray-900'>{parkingLot.latitude}</p>
                    </div>
                    <div className='mb-4'>
                        <p className='text-gray-700 font-medium'>Longitude:</p>
                        <p className='text-gray-900'>{parkingLot.longitude}</p>
                    </div>
                    <div className='mb-4'>
                        <p className='text-gray-700 font-medium'>Car Cost Per Hour:</p>
                        <p className='text-gray-900'>₹{parkingLot.car_cost_per_hour}</p>
                    </div>
                    <div className='mb-4'>
                        <p className='text-gray-700 font-medium'>Scooter Cost Per Hour:</p>
                        <p className='text-gray-900'>₹{parkingLot.scooter_cost_per_hour}</p>
                    </div>

                    <form onSubmit={handleFormSubmit}>
                        <div className='flex gap-4 mb-4'>
                            <input 
                                type="time" 
                                name='entry_time' 
                                placeholder='From' 
                                className='w-1/2 border-2 p-2 rounded-lg' 
                                required 
                            />
                            <input 
                                type="time" 
                                name='exit_time' 
                                placeholder='To' 
                                className='w-1/2 border-2 p-2 rounded-lg' 
                                required 
                            />
                        </div>
                        {formError && <p className='text-red-500 mb-4'>{formError}</p>}
                        <button className='mt-4 bg-black text-white w-full p-4 rounded-lg hover:bg-gray-800 transition-colors'>Book Now</button>
                    </form>
                </div>
            ) : (
                <p className='text-gray-600'>Loading...</p>
            )}
        </div>
    );
};

export default Parking;
