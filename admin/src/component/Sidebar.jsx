import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets_admin/assets'

const Sidebar = () => {

    const {token} = useContext(AdminContext)

  return (
    <div className='min-h-screen bg-white border-r '>
        {
            token && <ul className='text-[#515151] mt-5 '>
                <NavLink to={'/admin-dashboard'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.home_icon} alt="" />
                    <p>Dashboard</p>
                </NavLink>
                 <NavLink to={'/all-appointment'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.appointment_icon} alt="" />
                    <p>Appintment</p>
                </NavLink>
                 <NavLink to={'/add-doctor'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.add_icon} alt="" />
                    <p>Add doctor</p>
                </NavLink>
                 <NavLink to={'/doctor-list'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.people_icon} alt="" />
                    <p>Doctor List</p>
                </NavLink>
            </ul>
        }

    </div>
  )
}

export default Sidebar