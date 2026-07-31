import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'

const Myappointent = () => {

  const { doctors } = useContext(AppContext)
  const [isPay, setIsPay] = useState(false)

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <p className='text-2xl font-semibold text-gray-800 border-b pb-2'>
        My Appointments
      </p>

      <div className='mt-6 flex flex-col gap-6'>
        {doctors.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className='flex flex-col md:flex-row items-center md:items-start justify-between gap-6 p-5 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all'
          >

            {/* Doctor Image */}
            <img
              src={item.image}
              alt=""
              className='w-32 h-32 object-cover rounded-lg bg-gray-100'
            />

            {/* Doctor Details */}
            <div className='flex-1 text-center md:text-left'>
              <p className='text-xl font-semibold text-gray-800'>
                {item.name}
              </p>

              <p className='text-blue-500 font-medium mt-1'>
                {item.speciality}
              </p>

              <p className='mt-4 font-semibold text-gray-700'>
                Address:
              </p>

              <p className='text-gray-600'>
                {item.address.line1}
              </p>

              <p className='text-gray-600'>
                {item.address.line2}
              </p>

              <p className='mt-4 font-semibold text-gray-700'>
                Date & Time
              </p>

              <p className='text-gray-500'>
                25 July 2026 | 10:30 AM
              </p>
            </div>

            {/* Buttons */}
            <div className='flex flex-col gap-3 w-full md:w-48'>

              {isPay ? (
                <button
                  className='w-full py-2 rounded-lg bg-green-500 text-white font-medium cursor-default'
                >
                  Paid
                </button>
              ) : (
                <button
                  className='w-full py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all'
                >
                  Pay Here
                </button>
              )}

              <button
                className='w-full py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all'
              >
                Cancel Appointment
              </button>

            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Myappointent