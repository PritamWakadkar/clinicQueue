import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets_admin/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { currency } = useContext(AppContext)

  const {
    dtoken,
    dashData,
    setDashData,
    getdashData,
    cancelAppointment,
    markCompleteAppointment
  } = useContext(DoctorContext)


  // Get dashboard data
  useEffect(() => {

    if (dtoken) {
      getdashData()
    }

  }, [dtoken])


  // Complete appointment
  const handleComplete = async (appointmentId) => {

    const success = await markCompleteAppointment(appointmentId)

    if (success) {

      setDashData(prev => ({
        ...prev,

        latestAppointment: (prev.latestAppointment || []).map(item =>
          item._id === appointmentId
            ? {
                ...item,
                isCompleted: true
              }
            : item
        )
      }))

    }

  }


  // Cancel appointment
  const handleCancel = async (appointmentId) => {

    const success = await cancelAppointment(appointmentId)

    if (success) {

      setDashData(prev => ({
        ...prev,

        latestAppointment: (prev.latestAppointment || []).map(item =>
          item._id === appointmentId
            ? {
                ...item,
                cancelled: true
              }
            : item
        )
      }))

    }

  }


  // Don't render until dashboard data exists
  if (!dashData) {
    return null
  }


  return (

    <div className='m-5'>

      {/* Dashboard Cards */}

      <div className='flex flex-wrap gap-3'>

        {/* Earnings */}

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>

          <img
            className='w-14'
            src={assets.earning_icon}
            alt='Earnings'
          />

          <div>

            <p className='text-xl font-semibold text-gray-600'>
              {dashData.earning} {currency}
            </p>

            <p className='text-gray-400'>
              Earning
            </p>

          </div>

        </div>


        {/* Appointments */}

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>

          <img
            className='w-14'
            src={assets.appointments_icon}
            alt='Appointments'
          />

          <div>

            <p className='text-xl font-semibold text-gray-600'>
              {dashData.appointments}
            </p>

            <p className='text-gray-400'>
              Appointments
            </p>

          </div>

        </div>


        {/* Patients */}

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>

          <img
            className='w-14'
            src={assets.patients_icon}
            alt='Patients'
          />

          <div>

            <p className='text-xl font-semibold text-gray-600'>
              {dashData.patients}
            </p>

            <p className='text-gray-400'>
              Patients
            </p>

          </div>

        </div>

      </div>


      {/* Latest Booking */}

      <div className='bg-white'>

        {/* Header */}

        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>

          <img
            className='w-5'
            src={assets.list_icon}
            alt='List'
          />

          <p className='font-medium'>
            Latest Booking
          </p>

        </div>


        {/* Booking List */}

        <div className='pt-4 border border-t-0'>

          {
            (dashData.latestAppointment || []).map((item, index) => (

              <div
                key={item._id || index}
                className='
                  flex
                  items-center
                  px-6
                  py-3
                  gap-3
                  hover:bg-gray-100
                '
              >

                {/* Patient Image */}

                <img
                  className='rounded-full w-10 h-10 object-cover'
                  src={item.userData?.image}
                  alt='Patient'
                />


                {/* Patient Details */}

                <div className='flex-1 text-sm'>

                  <p className='text-gray-800 font-medium'>
                    {item.userData?.name || 'Unknown Patient'}
                  </p>

                  <p className='text-gray-600'>
                    {item.slotDate}
                  </p>

                </div>


                {/* Appointment Status */}

                <div className='flex items-center gap-3'>

                  {
                    item.isCompleted ? (

                      <p className='px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                        Completed
                      </p>

                    ) : item.cancelled ? (

                      <p className='px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600'>
                        Cancelled
                      </p>

                    ) : (

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
                            handleCancel(item._id)
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
                            handleComplete(item._id)
                          }
                        />

                      </>

                    )
                  }

                </div>

              </div>

            ))
          }


          {/* No appointments */}

          {
            (!dashData.latestAppointment ||
              dashData.latestAppointment.length === 0) && (

              <p className='text-center text-gray-400 py-8'>
                No appointments found
              </p>

            )
          }

        </div>

      </div>

    </div>

  )
}

export default DoctorDashboard