import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate} from 'react-router-dom'
const Myappointent = () => {

  const {
    backendUrl,
    token,
    getDoctorsData
  } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
const navigate = useNavigate()

  // =====================================================
  // GET USER APPOINTMENTS
  // =====================================================

  const getUserAppointments = async () => {

    try {

      const { data } = await axios.get(
        backendUrl + '/api/user/appointment',
        {
          headers: {
            token: token
          }
        }
      )

      console.log("Appointment API response:", data)

      if (data.success) {

        setAppointments(
          [...data.appointments].reverse()
        )

      } else {

        toast.error(
          data.message || "Unable to get appointments"
        )

      }

    } catch (error) {

      console.log(
        "Appointment Error:",
        error
      )

      console.log(
        "Backend error:",
        error.response?.data
      )

      toast.error(
        error.response?.data?.message ||
        "Server error while fetching appointments"
      )

    }

  }


  // =====================================================
  // CANCEL APPOINTMENT
  // =====================================================

  const cancelAppointment = async (appointmentId) => {

    try {

      // Confirmation
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this appointment?"
      )

      if (!confirmCancel) {
        return
      }


      console.log(
        "Cancelling appointment:",
        appointmentId
      )


      // Send appointment ID to backend
      const { data } = await axios.post(

        backendUrl + '/api/user/cancel-appointment',

        {
          appointmentId: appointmentId
        },

        {
          headers: {
            token: token
          }
        }

      )


      console.log(
        "Cancel response:",
        data
      )


      // =================================================
      // SUCCESS
      // =================================================

      if (data.success) {

        toast.success(
          data.message ||
          "Appointment cancelled successfully"
        )


        // Reload appointments
        await getUserAppointments()


        // IMPORTANT:
        // Reload doctor data so the cancelled
        // time becomes available again.
        await getDoctorsData()

      }


      // =================================================
      // ERROR FROM BACKEND
      // =================================================

      else {

        toast.error(
          data.message ||
          "Unable to cancel appointment"
        )

      }

    } catch (error) {

      console.log(
        "Cancel appointment error:",
        error
      )

      console.log(
        "Backend error:",
        error.response?.data
      )

      toast.error(
        error.response?.data?.message ||
        "Server error while cancelling appointment"
      )

    }

  }


  // =====================================================
  // LOAD APPOINTMENTS WHEN TOKEN EXISTS
  // =====================================================

  useEffect(() => {

    if (token) {

      getUserAppointments()

    }

  }, [token])

  const initPay = (order) =>{

    const options ={
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Appointment payment',
      description:'Appointment payment',
      order_id:order.id,
      receipt:order.receipt,
      handler:async (response)=>{
        console.log(response);
        
        try {

          const { data} = await axios.post(backendUrl+'/api/user/verifyRazorpay',response,{headers:{token}})
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }

        } catch (error) {
          console.log(error);
          toast.error(error.message)
          
        }
      }
    }
 const rzp = new window.Razorpay(options)
 rzp.open()
  }

  const appointmentRazorpay = async (appointmentId)=>{

    try {
      const {data} = await axios.post(backendUrl +'/api/user/payment-razorpay',{appointmentId},{headers:{token}})
      if(data.success){
         initPay(data.order)
        
      }
    } catch (error) {
      
    }

  }

  return (

    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* PAGE TITLE */}

      <h1 className="text-2xl font-semibold text-gray-800">

        My Appointments

      </h1>


      {/* APPOINTMENT LIST */}

      <div className="mt-6 flex flex-col gap-6">


        {/* NO APPOINTMENTS */}

        {appointments.length === 0 ? (

          <p className="text-gray-500 text-center py-10">

            No appointments found.

          </p>

        ) : (

          appointments.map((item, index) => {

            const doctor = item.docData


            return (

              <div
                key={item._id || index}
                className="
                  flex
                  flex-col
                  md:flex-row
                  items-center
                  md:items-start
                  justify-between
                  gap-6
                  p-5
                  border
                  border-gray-300
                  rounded-xl
                  shadow-sm
                "
              >


                {/* =================================================
                    DOCTOR IMAGE
                ================================================= */}

                {doctor?.image ? (

                  <img
                    src={doctor.image}
                    alt={doctor?.name || "Doctor"}
                    className="
                      w-32
                      h-32
                      object-cover
                      rounded-lg
                      bg-gray-100
                    "
                  />

                ) : (

                  <div
                    className="
                      w-32
                      h-32
                      rounded-lg
                      bg-gray-200
                      flex
                      items-center
                      justify-center
                      text-gray-500
                    "
                  >

                    No Image

                  </div>

                )}


                {/* =================================================
                    DOCTOR INFORMATION
                ================================================= */}

                <div
                  className="
                    flex-1
                    text-center
                    md:text-left
                  "
                >

                  {/* Doctor name */}

                  <p
                    className="
                      text-xl
                      font-semibold
                      text-gray-800
                    "
                  >

                    {doctor?.name || "Doctor"}

                  </p>


                  {/* Speciality */}

                  <p
                    className="
                      text-blue-500
                      font-medium
                      mt-1
                    "
                  >

                    {doctor?.speciality ||
                      "Speciality not available"}

                  </p>


                  {/* Address */}

                  <p
                    className="
                      mt-4
                      font-semibold
                      text-gray-700
                    "
                  >

                    Address:

                  </p>


                  <p className="text-gray-600">

                    {doctor?.address?.line1 || ""}

                  </p>


                  <p className="text-gray-600">

                    {doctor?.address?.line2 || ""}

                  </p>


                  {/* Date and time */}

                  <p
                    className="
                      mt-4
                      font-semibold
                      text-gray-700
                    "
                  >

                    Date & Time

                  </p>


                  <p className="text-gray-500">

                    {item.slotDate ||
                      "Date unavailable"}

                    {" | "}

                    {item.slotTime ||
                      "Time unavailable"}

                  </p>

                </div>


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    w-full
                    md:w-48
                  "
                >


                  {/* =================================================
                      PAYMENT BUTTON
                  ================================================= */}

                  {!item.cancelled && (

                    item.payment ? (

                      <button
                        disabled
                        className="
                          w-full
                          py-2
                          rounded-lg
                          bg-green-500
                          text-white
                          font-medium
                          cursor-default
                        "
                      >

                        Paid

                      </button>

                    ) : (

                      <button
                      onClick={()=>appointmentRazorpay(item._id)}
                        className="
                          w-full
                          py-2
                          rounded-lg
                          border
                          border-blue-500
                          text-blue-500
                          hover:bg-blue-500
                          hover:text-white
                          transition-all
                        "
                      >

                        Pay Here

                      </button>

                    )

                  )}


                  {/* =================================================
                      CANCEL BUTTON
                  ================================================= */}

                  {!item.cancelled ? (

                    <button
                      onClick={() =>
                        cancelAppointment(item._id)
                      }
                      className="
                        w-full
                        py-2
                        rounded-lg
                        border
                        border-red-500
                        text-red-500
                        hover:bg-red-500
                        hover:text-white
                        transition-all
                      "
                    >

                      Cancel Appointment

                    </button>

                  ) : (

                    <button
                      disabled
                      className="
                        w-full
                        py-2
                        rounded-lg
                        border
                        border-gray-400
                        text-gray-400
                        bg-gray-100
                        cursor-not-allowed
                      "
                    >

                      Appointment Cancelled

                    </button>

                  )}

                </div>

              </div>

            )

          })

        )}

      </div>

    </div>

  )

}

export default Myappointent