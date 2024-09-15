import { EyeIcon, EyeOff } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import List from '../../components/custom_components/List';
import UserContext from "../../store/user-context";
import Swal from 'sweetalert2';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();
    const currentRoute = useLocation();

    // Toast configuration for SweetAlert2
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const showPasswordHandler = () => {
        setShowPassword(true);
    };

    const hidePasswordHandler = () => {
        setShowPassword(false);
    };

    // Handle user login
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());

        try {
            const response = await axios.post("http://localhost:8000/user/login", data);

            // Update user context with login data
            userCtx.setUser(response.data);

            // Show success notification
            Toast.fire({
                icon: 'success',
                title: 'Login successful'
            });

            // Navigate to the user dashboard or other appropriate page
            navigate("/user");
        } catch (error) {
            // Show error notification
            Toast.fire({
                icon: 'error',
                title: 'Login failed. Please check your credentials and try again.'
            });

            console.error("Login error:", error);
        }
    };

    return (
        <div className='login flex py-12 px-10 gap-8'>
            <div className='login-left w-1/2'>
                <div className='flex w-full'>
                    <h1 className={`${currentRoute.pathname === "/auth/login" ? "border-b-2 border-cyan-500" : "border-b-2 border-slate-400"} w-1/2 text-center`}>Log In</h1>
                    <h1 className={`${currentRoute.pathname === "/auth/register" ? "border-b-2 border-cyan-500" : "border-b-2 border-slate-400"} w-1/2 text-center`}>Registration</h1>
                </div>

                <div>
                    <h1 className='text-2xl font-bold py-6'>Log in to your account</h1>
                    <form onSubmit={handleFormSubmit}>
                        <input
                            type="text"
                            placeholder="Email"
                            name='email'
                            className='border-2 p-2 rounded-lg w-full my-4'
                            required
                        />

                        <div className='relative mb-4'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Password'
                                name='password'
                                className='border-2 p-2 rounded-lg w-full pr-12'
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

                        <h2 className='text-blue-500 cursor-pointer'>Forgot your password?</h2>

                        <button
                            type='submit'
                            className='w-full mt-4 bg-light-violet px-4 py-2 rounded-lg text-dark-violet'
                        >
                            Login
                        </button>
                    </form>

                    <div className='mt-4 flex items-center justify-center gap-4'>
                        <p>Don't have a Parkour account yet?</p>
                        <Link to="/auth/register" className='text-blue-500 underline'>Sign Up</Link>
                    </div>
                </div>
            </div>

            <div className='flex gap-2 w-1/2'>
                <List />
            </div>
        </div>
    );
};

export default Login;
