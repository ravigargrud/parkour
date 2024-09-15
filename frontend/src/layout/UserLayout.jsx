import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../components/custom_components/Navbar';
import Footer from '../components/custom_components/Footer';

const UserLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default UserLayout;
