import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets_admin/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {

    const {token} = useContext(AdminContext)
    const {dtoken} = useContext(DoctorContext)    
  return (
    <div className='min-h-screen bg-white border-r '>
        {
            token && <ul className='text-[#515151] mt-5 '>
                <NavLink to={'/admin-dashboard'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.home_icon} alt="" />
                    <p className='hidden md:block'>Dashboard</p>
                </NavLink>
                 <NavLink to={'/all-appointment'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.appointment_icon} alt="" />
                    <p className='hidden md:block'>Appintment</p>
                </NavLink>
                 <NavLink to={'/add-doctor'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Add doctor</p>
                </NavLink>
                 <NavLink to={'/doctor-list'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.people_icon} alt="" />
                    <p className='hidden md:block'>Doctor List</p>
                </NavLink>
            </ul>
        }
      {
            dtoken && <ul className='text-[#515151] mt-5 '>
                <NavLink to={'/doctor-dashboard'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.home_icon} alt="" />
                    <p className='hidden md:block'>Dashboard</p>
                </NavLink>
                 <NavLink to={'/doctor-appointment'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.appointment_icon} alt="" />
                    <p className='hidden md:block'>Appintments</p>
                </NavLink>
                  
                 <NavLink to={'/doctor-profile'} className={({isActive})=>`flex items-center px-3 py-3.5 gap-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF] ':''}`}>
                    <img src={assets.people_icon} alt="" />
                    <p className='hidden md:block'>profile</p>
                </NavLink>
            </ul>
        }
    </div>
  )
}

export default Sidebar