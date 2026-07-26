import React from 'react'
import { assets } from '../assets/assets/assets_frontend/assets'

const Header = () => {
  return (
   <div className="flex flex-col md:flex-row bg-[#5F6FFF] rounded-lg px-20 md:px-10 lg:px-20 overflow-hidden  ">

  {/* Left */}
  <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-10 md:py-20">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
      Book Appointment
      <br />
      With Trusted
      <br />
      Doctors
    </h1>

    <div className="flex items-center gap-4">
      <img
        className="w-28"
        src={assets.group_profiles}
        alt=""
      />

      <p className="text-white text-sm">
        Simply browse through our extensive list of trusted doctors,
        <br />
        schedule your appointment hassle-free.
      </p>
    </div>

    <a
      href="#speciality"
      className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-700 hover:scale-105 transition-all"
    >
      Book Appointment
      <img className="w-3" src={assets.arrow_icon} alt="" />
    </a>
  </div>

  {/* Right */}
  <div className="md:w-1/2 flex items-end justify-center">
    <img
      className="w-full max-w-md lg:max-w-lg"
      src={assets.header_img}
      alt=""
    />
  </div>

</div>
  )
}

export default Header