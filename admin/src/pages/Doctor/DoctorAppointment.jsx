import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets_admin/assets'

const DoctorAppointment = () => {

  const {
    dtoken,
    appointment,
    getAppointments,
    markCompleteAppointment,
    cancelAppointment
  } = useContext(DoctorContext)

  const {
    calculateAge,
    currency
  } = useContext(AppContext)

  useEffect(() => {
    if (dtoken) {
      getAppointments()
    }
  }, [dtoken])

  return (
    <div className='w-full max-w-6xl mx-auto p-5'>

      {/* Page Title */}
      <p className='mb-4 text-xl font-semibold text-gray-800'>
        All Appointments
      </p>

      {/* Appointment Table */}
      <div className='bg-white border border-gray-200 rounded-lg text-sm shadow-sm overflow-hidden'>

        {/* Header */}
        <div
          className='
            hidden sm:grid
            grid-cols-[40px_1.4fr_0.8fr_0.6fr_1.4fr_0.7fr_0.7fr]
            gap-3
            py-4
            px-6
            bg-gray-50
            border-b
            font-medium
            text-gray-700
          '
        >
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointment Rows */}
        {
          appointment.reverse().map((item, index) => (

            <div
              key={index}
              className='
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
                sm:grid
                sm:grid-cols-[40px_1.4fr_0.8fr_0.6fr_1.4fr_0.7fr_0.7fr]
                sm:gap-3
                py-4
                px-6
                border-b
                last:border-b-0
                hover:bg-gray-50
                transition
                text-gray-600
              '
            >

              {/* Number */}
              <p className='font-medium text-gray-700'>
                {index + 1}
              </p>

              {/* Patient */}
              <div className='flex items-center gap-3'>

                <img
                  className='
                    w-10
                    h-10
                    rounded-full
                    object-cover
                    border
                    border-gray-200
                  '
                  src={item.userData.image}
                  alt=''
                />

                <p className='font-medium text-gray-700 truncate'>
                  {item.userData.name}
                </p>

              </div>

              {/* Payment */}
              <div>

                <p
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-medium
                    w-fit
                    ${item.payment
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {item.payment ? 'Paid' : 'CASH'}
                </p>

              </div>

              {/* Age */}
              <p>
                {calculateAge(item.userData.dob)}
              </p>

              {/* Date & Time */}
              <p className='whitespace-nowrap text-gray-600'>
                {item.slotDate}

                <span className='mx-1 text-gray-400'>
                  |
                </span>

                {item.slotTime}
              </p>

              {/* Fees */}
              <p className='font-medium text-gray-700 whitespace-nowrap'>
                {currency}
                {item.amount}
              </p>

              {/* Action */}
              <div className='flex items-center gap-3'>

                {/* Completed */}
                {
                  item.isCompleted ? (

                    <p className='
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      bg-green-100
                      text-green-700
                    '>
                      Completed
                    </p>

                  )

                    /* Cancelled */
                    : item.cancelled ? (

                      <p className='
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      bg-red-100
                      text-red-600
                    '>
                        Cancelled
                      </p>

                    )

                      /* Pending */
                      : (

                        <>

                          {/* Cancel */}
                          <img
                            className='
                          w-8
                          h-8
                          cursor-pointer
                          hover:scale-110
                          transition-transform
                        '
                            src={assets.cancel_icon}
                            alt='Cancel'
                            onClick={() =>
                              cancelAppointment(item._id)
                            }
                          />

                          {/* Complete */}
                          <img
                            className='
                          w-8
                          h-8
                          cursor-pointer
                          hover:scale-110
                          transition-transform
                        '
                            src={assets.tick_icon}
                            alt='Complete'
                            onClick={() =>
                              markCompleteAppointment(item._id)
                            }
                          />

                        </>

                      )
                }

              </div>

            </div>

          ))
        }

      </div>

    </div>
  )
}

export default DoctorAppointment