import React from 'react'
import { Link, Outlet } from 'react-router-dom'

import LOGO_ALT from "../assets/logo-alt.png";

function Auth() {
    return (
        <div className='w-[95%] mx-auto'>
            <div className='border-b-2 py-2'>
                <Link to="/user"><img src={LOGO_ALT} alt="logo" className='text-black' /></Link>
            </div>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Auth
