import React, { useState } from 'react'
import { assets } from '../assets/assets/assets_frontend/assets'
const MyProfile = () => {

  const [userData, steUserData] = useState({
    name: "pritam wakadkar",
    image: assets.profile_pic,
    email: 'pritamwakadkar@gmail.com',
    phone: '+91 9579090343',
    address: {
      line1: "57th cross, Richmond",
      line2: "Circle, road London"
    },
    gender: "Male",
    dob: "2006-01-01"
  })

  const [isEdit, setIsEdit] = useState(false)

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      <img src={userData.image} alt="" />
      {
        isEdit
          ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' value={userData.name} type="text" onChange={(e) => steUserData(prev => ({ ...prev, name: e.target.value }))} />
          : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none'/>

      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
            isEdit
              ? <input className='bg-gray-100 max-w-52' value={userData.phone} type="text" onChange={(e) => steUserData(prev => ({ ...prev, phone: e.target.value }))} />
              : <p className='text-blue-400'>{userData.phone}</p>
          }
          <p className='font-medium'>Adderess:</p>
          {
            isEdit ?
              <p>
                <input className='bg-gray-50' onChange={(e)=>steUserData(prev =>({...prev , address:{...prev.address,line1: e.target.value}}))} value={userData.address.line1} type="text" />
                <br />
                <input className='bg-gray-50' onChange={(e)=>steUserData(prev=>({...prev , address:{...prev.address, line2:e.target.value}}))} value={userData.address.line2} type="text" />
              </p> :
              <p className='text-gray-500'>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
          }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {
            isEdit ?
              <select className='smax-w-20 bg-gray-100' onChange={(e)=>steUserData(prev=>({...prev , gender:e.target.value}))} value={userData.gender}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            : <p className='text-gray-400'>{userData.gender}</p>
          }

          <p className='font-medium'>Birthday</p>
          {
            isEdit 
            ? <input  className='max-w-28 bg-gray-100' type="date"  onChange={(e)=>steUserData(prev=>({...prev , dob:e.target.value}))} value={userData.dob}/>
            : <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>
      <div className='mt-10'>
        {
          isEdit ?
          <button className='border border-blue-400 px-8 py-2 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white transition-all' onClick={()=>setIsEdit(false)}>Save information</button>
          : <button className='border border-blue-400 px-8 py-2 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white transition-all' onClick={()=>setIsEdit(true)}>Edit</button>
        }
      </div>

    </div>
  )
}

export default MyProfile