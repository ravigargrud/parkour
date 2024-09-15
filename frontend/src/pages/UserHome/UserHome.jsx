import React, { useEffect } from 'react'
import Map from '../../components/core_components/Booking/Map'
import HomeCard from './UserHomeCard'

import PARK1 from "../../assets/parking/park1.png";
import PARK2 from "../../assets/parking/park2.png";
import PARK3 from "../../assets/parking/park3.png";

import FEATURE1 from "../../assets/features/feature1.png";
import FEATURE2 from "../../assets/features/feature2.png";
import FEATURE3 from "../../assets/features/feature3.png";

import { CloudLightning, Flashlight, Lock, Phone, Search } from 'lucide-react';

import EVENT from "../../assets/event.png";
import GIRL_IN_CAR from "../../assets/girl-in-car.png";
import List from '../../components/custom_components/List';

const UserHome = () => {
  return (
    <div className="max-w-[90%] mx-auto">
      <Map />
      <div>
        <h1 className='font-bold text-custom-blue text-3xl mt-12'>Trending Near You</h1>

        <div className='flex w-full items-center justify-betweeng gap-24 my-6'>
          <HomeCard parkingImg={PARK1} />
          <HomeCard parkingImg={PARK2} />
          <HomeCard parkingImg={PARK3} />
        </div>

        <div className='flex gap-6 my-24 h-[17rem]'>
          <div className='flex flex-col w-1/2 bg-[#f8f1e3] p-4 items-center rounded-2xl '>
            <p className='text-2xl font-bold my-4 text-center'>Reserve your parking spot in advance</p>
            <div className='flex items-center justify-between gap-4 mt-4 w-2/3'>
              <Search className='text-gray-800' />
              <input type="text" placeholder="I want to park near..." className='w-full px-8 py-2' />
            </div>
            <button className="text-white bg-black py-2 rounded-lg w-1/2 mx-auto mt-8 mb-8">Book your spot</button>
          </div>

          <div className='h-auto flex flex-col w-1/2 p-4 items-center object-cover bg-no-repeat rounded-2xl' style={{ backgroundImage: `url(${EVENT})` }}>
            <p className='text-2xl font-bold my-4'>Event Parking</p>
            <div className='flex items-center justify-between gap-4 mt-4 w-2/3'>
              <Search className='text-gray-800' />
              <input type="text" placeholder="I want to attend..." className='w-full px-8 py-2' />
            </div>
            <button className="text-white bg-black py-2 rounded-lg w-1/2 mx-auto mt-8 mb-8">Book your spot</button>
          </div>
        </div>

        <div>
          <h1 className='text-2xl font-bold text-center'>How Parkour Works</h1>
          <div className='flex items-center justify-between my-10 w-4/5 mx-auto'>
            <div className='flex flex-col items-center flex-1'>
              <img src={FEATURE1} alt="" className='h-[10rem]' />
              <h2 className='text-xl font-bold my-6'>Look</h2>
              <p className='w-1/2 text-center'>Search and compare prices thousands of parking facilities</p>
            </div>
            <div className='flex flex-col items-center flex-1'>
              <img src={FEATURE2} alt="" className='h-[10rem]' />
              <h2 className='text-xl font-bold my-6'>Book</h2>
              <p className='w-1/2 text-center'>Pay securely and receive a parking pass instantly via email </p>
            </div>
            <div className='flex flex-col items-center flex-1'>
              <img src={FEATURE3} alt="" className='h-[10rem]' />
              <h2 className='text-xl font-bold my-6'>Park</h2>
              <p className='w-1/2 text-center'>Enjoy your space, secure and hassle-free</p>
            </div>
          </div>
        </div>

        <div className='flex gap-2 my-32'>
          <List />

          <div>
            <img src={GIRL_IN_CAR} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserHome