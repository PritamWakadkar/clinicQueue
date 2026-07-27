import React from 'react'
import { assets } from '../assets/assets/assets_frontend/assets'
import { useNavigate } from 'react-router-dom'

function Banner() {
  const nevigate= useNavigate()
  return (
    <div className='flex bg-blue-500 rounded-lg px-6 sm:px-10 lg:px-10 my-20 md:mx-10 '>
      {/* --------left side ------------ */}
      <div className='flex-1 py-5 sm:py-10 lg:py-16 lg:pl-5'>
      <div className='text-white font-semibold text-xl px-3 lg:text-5xl md:text-3xl '>
         <p>Book Appointmrnt</p>
         <p className='mt-4'>With 100+ Trusted Doctors</p>
      </div>
      <button onClick={()=>{nevigate('/login');scrollTo(0,0)}} className='bg-white text-sm sm:text-base text-gray-500 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'>Create account</button>
      </div>

      {/* ----------right side----------- */}
      <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
        <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
      </div>
    </div>
  )
}

export default Banner
