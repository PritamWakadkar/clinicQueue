import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext.jsx'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext.jsx'
import { assets } from '../../assets/assets_admin/assets.js'

const AllAppointment = () => {

  const { token, appointments, getAllAppointments,cancelAppointment } = useContext(AdminContext)
  const { calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (token) {
      getAllAppointments()
    }
  }, [token])

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>

      <p className='mb-5 text-xl font-semibold text-gray-800'>
        ALL Appointments
      </p>

      <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>

        {/* Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center py-4 px-6 bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold'>

          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>

        </div>

        {/* Appointments */}
        <div className='max-h-[80vh] min-h-[60vh] overflow-y-auto'>

          {appointments.map((item, index) => (

            <div
              key={index}
              className='
                flex flex-wrap items-center justify-between
                gap-4
                max-sm:p-4
                sm:grid
                sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]
                sm:gap-4
                sm:py-4
                sm:px-6
                text-sm
                text-gray-600
                border-b border-gray-100
                hover:bg-gray-50
                transition-colors
              '
            >

              {/* Number */}
              <p className='max-sm:hidden text-gray-500'>
                {index + 1}
              </p>

              {/* Patient */}
              <div className='flex items-center gap-3 min-w-0'>
                <img
                  className='w-9 h-9 rounded-full object-cover bg-gray-100 flex-shrink-0'
                  src={item.userData.image}
                  alt=''
                />

                <p className='font-medium text-gray-700 truncate'>
                  {item.userData.name}
                </p>
              </div>

              {/* Age */}
              <p className='max-sm:hidden text-gray-600'>
                {calculateAge(item.userData.dob)}
              </p>

              {/* Date & Time */}
              <p className='text-gray-600'>
                {item.slotDate} || {item.slotTime}
              </p>

              {/* Doctor */}
              <div className='flex items-center gap-3 min-w-0'>
                <img
                  className='w-8 h-8 rounded-full object-cover bg-gray-200 flex-shrink-0'
                  src={item.docData.image}
                  alt=''
                />

                <p className='font-medium text-gray-700 truncate'>
                  {item.docData.name}
                </p>
              </div>

              {/* Fees */}
              <p className='font-medium text-gray-700'>
                {currency}{item.amount}
              </p>
              {item.cancelled
              ?
              <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : <img
                onClick={()=>cancelAppointment(item._id)}
                  className='w-10  p-1 cursor-pointer rounded-md hover:bg-red-50 transition-colors'
                  src={assets.cancel_icon}
                  alt=''
                />
            }
            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default AllAppointment