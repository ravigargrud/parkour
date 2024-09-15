import React, { useRef, useState } from 'react';
import ADD_IMAGE from "../../assets/add-image.png";
import axios from 'axios';
import { saveAs } from 'file-saver';

const ListSpace = () => {
    const [imagePreviews, setImagePreviews] = useState([null]); // Array to hold multiple image previews
    const [imagePaths, setImagePaths] = useState([]); // Array of objects to hold image paths
    const fileInputRefs = useRef([]); // Array to hold refs for each file input

    const generateRandomFileName = (extension = 'png') => {
        // Generate a random string for the file name
        const randomString = Math.random().toString(36).substring(2, 15);
        return `image_${randomString}.${extension}`;
    };

    const handleImageClick = (index) => {
        // Trigger the hidden file input for the clicked image placeholder
        fileInputRefs.current[index].click();
    };

    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            // Create a URL for the uploaded file and update the state
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prevPreviews => {
                    const updatedPreviews = [...prevPreviews];
                    updatedPreviews[index] = reader.result;
                    return updatedPreviews;
                });

                // Generate a random file name
                const randomFileName = generateRandomFileName(file.type.split('/')[1]); // Use file extension from MIME type
                const imagePath = `./parking_image/${randomFileName}`;
                console.log(imagePath);

                // Save the file locally (simulated)
                saveAs(file, imagePath);

                setImagePaths(prevPaths => [...prevPaths, { imgLink: imagePath }]);

                // Automatically add a new file input after a successful upload
                if (index === imagePreviews.length - 1) {
                    addImageInput();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addImageInput = () => {
        setImagePreviews(prevPreviews => [...prevPreviews, null]);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());

        // Handle location address conversion to latitude and longitude
        let locationData = {};
        try {
            const addressResponse = await axios.get(
                `http://api.positionstack.com/v1/forward`,
                {
                    params: {
                        access_key: "13d02bda45d330732b2600b36b85fc55", // Use environment variable
                        query: data.location
                    }
                }
            );

            if (addressResponse.data.data && addressResponse.data.data.length > 0) {
                locationData = {
                    latitude: addressResponse.data.data[0].latitude,
                    longitude: addressResponse.data.data[0].longitude,
                    address: data.location,
                };
            }
        } catch (error) {
            console.error('Error fetching location data:', error);
        }

        const finalData = {
            location: locationData,
            contact_no: data.contact_no,
            scooter_cost_per_hour: parseFloat(data.scooter_cost_per_hour) || 0,
            car_cost_per_hour: parseFloat(data.car_cost_per_hour) || 0,
            parking_photos: imagePaths, // Send image paths instead of image files
            total_capacity: parseInt(data.total_capacity) || 0,
            currently_occupied: parseInt(data.currently_occupied) || 0,
        };

        console.log(finalData);

        try {
            // Submit the data
            await axios.post('http://localhost:8000/parking/create-lot', finalData);
            console.log('Data successfully submitted');
        } catch (error) {
            console.error('Error submitting data:', error);
            // Show error to user
        }
    };

    return (
        <form className='mt-[85px] px-16 py-8' onSubmit={handleFormSubmit}>
            <h1 className='text-4xl font-bold my-4'>List a Space</h1>

            <h2 className='text-xl mb-2 py-4 font-bold'>Parking Details</h2>

            <div>
                <p className='text-lg font-medium mb-2 text-gray-400 py-2'>
                    Upload Images:
                </p>
                <div className='flex flex-wrap gap-4'>
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className='relative cursor-pointer'>
                            <img
                                src={preview || ADD_IMAGE} // Show the uploaded image or the placeholder
                                alt={`Upload Image ${index}`}
                                className='w-32 h-32 object-cover' // Set size as needed
                                onClick={() => handleImageClick(index)}
                            />
                            <input
                                type='file'
                                ref={el => fileInputRefs.current[index] = el}
                                style={{ display: 'none' }}
                                onChange={(event) => handleFileChange(event, index)}
                                accept='image/*' // Ensure only image files can be selected
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex gap-12'>
                <div className='flex flex-col w-1/2'>
                    <label htmlFor="name" className='text-gray-400 my-2'>Name</label>
                    <input type="text" name='name' id='name' className='border-2 rounded-lg p-2' required />

                    <label htmlFor="total_capacity" className='text-gray-400 my-2'>Total Capacity</label>
                    <input type="text" name='total_capacity' id='total_capacity' className='border-2 rounded-lg p-2' required />

                    <label htmlFor="currently_occupied" className='text-gray-400 my-2'>Currently Occupied</label>
                    <input type="text" name='currently_occupied' id='currently_occupied' className='border-2 rounded-lg p-2' required />

                    <label htmlFor="scooter_cost_per_hour" className='text-gray-400 my-2'>Scooter Cost per Hour</label>
                    <input type="text" name='scooter_cost_per_hour' id='scooter_cost_per_hour' className='border-2 rounded-lg p-2' required />

                    <label htmlFor="car_cost_per_hour" className='text-gray-400 my-2'>Car Cost per Hour</label>
                    <input type="text" name='car_cost_per_hour' id='car_cost_per_hour' className='border-2 rounded-lg p-2' required />
                </div>

                <div className='flex flex-col w-1/2'>
                    <label htmlFor="location" className='text-gray-400 my-2'>Location</label>
                    <input type="text" name='location' id='location' className='border-2 rounded-lg p-2' required />

                    <label htmlFor="contact_no" className='text-gray-400 my-2'>Contact Number</label>
                    <input type="text" name='contact_no' id='contact_no' className='border-2 rounded-lg p-2' required />

                    {/* <label htmlFor="timings" className='text-gray-400 my-2'>Timings</label>
                    <input type="text" name='timings' id='timings' className='border-2 rounded-lg p-2' required /> */}
                </div>
            </div>

            <div className='w-full flex font-bold text-2xl'>
                <button type="submit" className='text-white bg-black py-4 rounded-lg w-full mt-12 mx-auto'>Submit</button>
            </div>
        </form>
    );
};

export default ListSpace;
