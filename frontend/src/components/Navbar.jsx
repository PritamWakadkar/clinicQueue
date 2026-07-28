import React, { useState } from 'react'
import {assets} from "../assets/assets/assets_frontend/assets"
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

    const nevigate = useNavigate();
    const [Showmenu, setShowMenu] = useState(false);
    const [Token, setToken] = useState(true);

  return (
    <div className='flex items-center justify-between text-sm mb-5 py-4 border-b border-b-gray-400'>
        <img onClick={()=>{nevigate('/');scrollTo(0,0)}} className='w-44 cursor-pointer'  src={assets.logo} alt="" />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='py-1'>Home</li> 
                <hr className='border-none outline-none h-0.5  bg-[#5f6FFF] w-3/5 m-auto hidden'/>
            </NavLink>
             <NavLink to='/doctors'>
                <li className='py-1'>All doctors</li> 
                <hr className='border-none outline-none h-0.5  bg-[#5f6FFF] w-3/5 m-auto hidden'/>
            </NavLink>
             <NavLink to='/about'>
                <li className='py-1'>About</li> 
                <hr className='border-none outline-none h-0.5  bg-[#5f6FFF] w-3/5 m-auto hidden'/>
            </NavLink>
             <NavLink to='/contact'>
                <li className='py-1'>Contact</li> 
                <hr className='border-none outline-none h-0.5  bg-[#5f6FFF] w-3/5 m-auto hidden'/>
            </NavLink>
        </ul>
        <div className=' items-center gap-4'>
            {
                Token ? <div className='flex items-center justify-between cursor-pointer gap-2 group relative'>
                    <img className='w-8 rounded-full' src={assets.profile_pic} alt="" />
                    <img className='w-2.5 pt-2' src={assets.dropdown_icon} alt="" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col p-4 gap-4 '>
                            <p onClick={()=>nevigate('/my-profile')} className='hover:text-black cursor-pointer'>My profile</p>
                            <p onClick={()=>nevigate('/my-appointments')} className='hover:text-black cursor-pointer'>My appointments</p>
                            <p onClick={()=>setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                : <button onClick={()=>nevigate('/login')} className='bg-[#5f6FFF] text-white px-8 py-2 rounded-full font-light hidden md:block'>Create Account</button>
            }
           
        </div>
    </div>
  )
}

export default Navbar