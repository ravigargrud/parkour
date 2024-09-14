import React from 'react'
import Navbar from '../components/custom_components/Navbar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <div>
            <Navbar />
            <div>
                <h1>Admin</h1>
            </div>
        </div>
    )
}

export default AdminLayout
