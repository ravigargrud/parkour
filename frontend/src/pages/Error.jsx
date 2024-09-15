import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-extrabold text-red-500 mb-4">404</h1>
                <p className="text-lg font-medium text-gray-700">Oops! The page you’re looking for does not exist.</p>
                <p className="text-sm text-gray-500 mt-2">It might have been removed, or you might have mistyped the URL.</p>
                <Link
                    to="/user"
                    className="mt-6 inline-block px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
};

export default Error;
