import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {


    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
   const [dashData,setDashData] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { token } })
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors);

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailablity = async (docId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/change-availablity",
                { docId },
                {
                    headers: {
                        token
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);

                // Immediately update React state
                setDoctors((prevDoctors) =>
                    prevDoctors.map((doctor) =>
                        doctor._id === docId
                            ? {
                                ...doctor,
                                availablity: !doctor.availablity
                            }
                            : doctor
                    )
                );
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log("CHANGE AVAILABILITY ERROR:", error);

            toast.error(
                error.response?.data?.message || error.message
            );
        }
    };

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { token } })
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments);

            } else {
                toast.error(data.message)
            }


        } catch (error) {
            console.log("Get appointments error:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to get appointments"
            );
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {

            const {data} = await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{token}})

            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log("Get appointments error:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to get appointments"
            );
        }
    }

    const getDashData = async ()=>{
        try {

            const {data} = await axios.get(backendUrl+'/api/admin/dashBoard',{headers:{token}})
            console.log(data);
            
            if (data.success) {
                setDashData(data.dashData)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
              toast.error(error.message)
        }
    }

    const value = {
        token,
        setToken,
        backendUrl,
        getAllDoctors,
        doctors,
        changeAvailablity,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        getDashData,dashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider