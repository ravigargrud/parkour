import { EyeIcon, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";
import List from '../../components/custom_components/List';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);

    const showPasswordHandler = () => {
        setShowPassword(true);
    };

    const hidePasswordHandler = () => {
        setShowPassword(false);
    };

    const currentRoute = useLocation();

    // Handle user login
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());

        try {
            const response = await axios.post("http://localhost:8000/user/create", data);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className='login flex py-12 px-10 gap-8'>
            <div className='login-left w-1/2'>
                <div className='flex w-full'>
                    <h1 className={`${currentRoute.pathname === "/auth/login" ? "border-b-4 border-cyan-500" : "border-b-2 border-slate-400"} w-1/2 text-center`}>Log In</h1>
                    <h1 className={`${currentRoute.pathname === "/auth/register" ? "border-b-2 border-cyan-500" : "border-b-2 border-slate-400"} w-1/2 text-center`}>Registration</h1>
                </div>

                <div>
                    <h1 className='text-2xl font-bold py-6'>Log in to your account</h1>
                    <form onSubmit={handleFormSubmit}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            name='name'
                            className='border-2 p-2 rounded-lg w-full my-2'
                            required
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            name='email'
                            className='border-2 p-2 rounded-lg w-full my-2'
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            name='phone'
                            className='border-2 p-2 rounded-lg w-full my-2'
                            required
                        />
                        <input
                            type="text"
                            placeholder="Vehicle Number"
                            name='vehicle_number'
                            className='border-2 p-2 rounded-lg w-full my-2'
                            required
                        />

                        <div className='relative mb-4'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Password'
                                name='password'
                                className='border-2 p-2 rounded-lg w-full pr-12 my-2'
                                required
                            />
                            <button
                                type='button'
                                onMouseDown={showPasswordHandler}
                                onMouseUp={hidePasswordHandler}
                                onMouseLeave={hidePasswordHandler}
                                className='absolute inset-y-0 right-0 flex items-center px-3'
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {!showPassword ? <EyeIcon className='w-5 h-5' /> : <EyeOff className='w-5 h-5' />}
                            </button>
                        </div>

                        <button
                            type='submit'
                            className='w-full mt-4 bg-light-violet text-white px-4 py-2 rounded-lg text-dark-violet'
                        >
                            Register
                        </button>
                    </form>

                    <div className='mt-4 flex items-center justify-center gap-4'>
                        <p>Do you have a Parkour account?</p>
                        <Link to="/auth/login" className='text-blue-500 underline'>Log In</Link>
                    </div>
                </div>
            </div>

            <div className='flex gap-2 w-1/2'>
                <List />
            </div>
        </div>
    );
};

export default Register;
