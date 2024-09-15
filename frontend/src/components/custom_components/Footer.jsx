import React from 'react'

import LOGO from "../../assets/logo.png";

import FACEBOOK from "../../assets/facebook.png";
import INSTAGRAM from "../../assets/instagram.png";
import TWITTER from "../../assets/twitter.png";
import YOUTUBE from "../../assets/youtube.png";

const Footer = () => {
    return (
        <footer className='bg-custom-blue p-8 flex  justify-between items-center'>
            <div className='flex gap-24 '>
                <img src={LOGO} alt="logo" className='h-12' />
                <div className='text-white'>
                    <h2 className='text-xl'>Book Parking</h2>
                    <p className='text-sm my-2 font-light'>All Parkings</p>
                    <p className='text-sm my-2 font-light'>Monthly Parking</p>
                    <p className='text-sm my-2 font-light'>Privacy Policy</p>
                </div>
                <div className='text-white'>
                    <h2 className='text-xl font-light'>Sell Parking</h2>
                    <p className='text-sm my-2 font-light'>License</p>
                    <p className='text-sm my-2 font-light'>Operators</p>
                </div>
                <div className='text-white'>
                    <h2 className='text-xl'>Company</h2>
                    <p className='text-sm my-2 font-light'>About Us</p>
                    <p className='text-sm my-2 font-light'>Contact Us</p>
                    <p className='text-sm my-2 font-light'>Privacy Policy</p>
                </div>
            </div>

            <div className='flex gap-2'>
                <a href='https://www.facebook.com/'><img src={FACEBOOK} alt="" /></a>
                <a href='https://www.instagram.com/'><img src={INSTAGRAM} alt="" /></a>
                <a href='https://www.twitter.com/'><img src={TWITTER} alt="" /></a>
                <a href='https://www.youtube.com/'><img src={YOUTUBE} alt="" /></a>
            </div>
        </footer>
    )
}

export default Footer
