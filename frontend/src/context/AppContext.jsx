import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = "$";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);

    const [token, setToken] = useState(
        localStorage.getItem("token") || ""
    );

    // Keep the same structure as your MongoDB user document
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        image: "",
        phone: "",
        address: {
            line1: "",
            line2: ""
        },
        gender: "",
        dob: ""
    });


    // =========================
    // GET DOCTORS
    // =========================
    const getDoctorsData = async () => {
        try {

            const { data } = await axios.get(
                backendUrl + "/api/doctor/list"
            );

            console.log("DOCTORS:", data);

            if (data.success) {

                setDoctors(data.doctors);

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log("DOCTOR ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };


    // =========================
    // GET USER PROFILE
    // =========================
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(
                backendUrl + "/api/user/get-profile",
                {
                    headers: {
                        token: token
                    }
                }
            );

            console.log("PROFILE API RESPONSE:", data);

            if (data.success) {

                const user = data.userData;

                console.log(
                    "ADDRESS FROM BACKEND:",
                    user?.address
                );

                setUserData({
                    name: user?.name || "",
                    email: user?.email || "",
                    image: user?.image || "",
                    phone: user?.phone || "",

                    address: {
                        line1: user?.address?.line1 || "",
                        line2: user?.address?.line2 || ""
                    },

                    gender: user?.gender || "",
                    dob: user?.dob || ""
                });

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log("PROFILE ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };

    // ==================
    // get appointment data
    // ===================

    const appointmentData=async ()=>{
        
    }


    // =========================
    // LOAD DOCTORS
    // =========================
    useEffect(() => {

        getDoctorsData();

    }, []);

   
    // =========================
    // LOAD USER PROFILE
    // =========================
    useEffect(() => {

        if (token) {

            loadUserProfileData();

        }

    }, [token]);


    const value = {
        doctors,getDoctorsData,
        currencySymbol,

        token,
        setToken,

        backendUrl,

        userData,
        setUserData,

        loadUserProfileData
    };


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;