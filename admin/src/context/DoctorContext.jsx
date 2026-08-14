import { useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dtoken, setDtoken] = useState(
        localStorage.getItem("dtoken") || ""
    );

    const [appointment, setAppointment] = useState([]);
    const [dashData, setDashData] = useState(false)
    const [profileData ,setProfileData] = useState(false)

    const getAppointments = async () => {
        try {

            const { data } = await axios.get(
                backendUrl + "/api/doctor/appointments",
                {
                    headers: {
                        token: dtoken
                    }
                }
            );

            if (data.success) {

                const appointments = [...data.appointment].reverse();

                setAppointment(appointments);

                console.log(appointments);

            } else {
                toast.error(data.message);
            }

        } catch (error) {

            console.log(error);
            toast.error(error.message);

        }
    };

    const markCompleteAppointment = async (appointmentId) => {
    try {

        const { data } = await axios.post(
            backendUrl + '/api/doctor/appointment-completed',
            { appointmentId },
            {
                headers: {
                    token: dtoken
                }
            }
        )

        if (data.success) {

            toast.success(data.message)

            // Update only the clicked appointment
            setAppointment(prevAppointments =>
                prevAppointments.map(item =>
                    item._id === appointmentId
                        ? { ...item, isCompleted: true }
                        : item
                )
            )

        } else {
            toast.error(data.message)
        }

    } catch (error) {

        console.log(error)

        toast.error(
            error.response?.data?.message || error.message
        )
    }
}

   const cancelAppointment = async (appointmentId) => {
    try {

        const { data } = await axios.post(
            backendUrl + '/api/doctor/cancel-appointment',
            { appointmentId },
            {
                headers: {
                    token: dtoken
                }
            }
        )

        if (data.success) {

            toast.success(data.message)

            setAppointment(prevAppointments =>
                prevAppointments.map(item =>
                    item._id === appointmentId
                        ? { ...item, cancelled: true }
                        : item
                )
            )

        } else {
            toast.error(data.message)
        }

    } catch (error) {

        console.log(error)

        toast.error(
            error.response?.data?.message || error.message
        )
    }
}



    const getdashData = async () => {
        try {

            const {data} = await axios.get(backendUrl+'/api/doctor/dashboard',{headers:{token:dtoken}})

            if (data.success) {
               console.log(data.dashData);
               
                setDashData(data.dashData)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getProfileData = async (req,res) =>{
        
        try {
            
            const {data} = await axios.get(backendUrl +'/api/doctor/doctor-profile',{headers:{token:dtoken}})

            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData);
                
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }

   }


    const value = {
        dtoken,
        setDtoken,
        backendUrl,
        appointment,
        setAppointment,
        getAppointments,
        markCompleteAppointment,
        cancelAppointment,
        dashData,setDashData,getdashData,
        profileData,setProfileData,getProfileData
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;