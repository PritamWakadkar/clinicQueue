import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets/assets_frontend/assets";
import RelatedDoctor from "../components/RelatedDoctor";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();

  const {
    doctors,
    currencySymbol,
    backendUrl,
    getDoctorsData,
    token,
  } = useContext(AppContext);

  const daysOfWeek = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
  ];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // ==========================================
  // GET DOCTOR INFORMATION
  // ==========================================

  const fetchDocInfo = async () => {
    const doctor = doctors.find((doc) => doc._id === docId);

    if (doctor) {
      setDocInfo(doctor);
    }
  };

  // ==========================================
  // GET AVAILABLE SLOTS
  // ==========================================

  const getAvailableSlots = async () => {
    if (!docInfo) return;

    let allSlots = [];

    const today = new Date();

    // Generate slots for next 7 days
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);

      currentDate.setDate(today.getDate() + i);

      // ----------------------------------
      // END TIME = 9 PM
      // ----------------------------------

      let endTime = new Date(today);

      endTime.setDate(today.getDate() + i);

      endTime.setHours(21, 0, 0, 0);

      // ----------------------------------
      // START TIME = 10 AM
      // ----------------------------------

      if (i === 0) {
        /*
          For today:
          Start from the next available 30-minute slot.
        */

        const currentHour = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();

        if (currentHour >= 21) {
          // No slots available today
          allSlots.push([]);
          continue;
        }

        if (currentHour < 10) {
          currentDate.setHours(10, 0, 0, 0);
        } else {
          currentDate.setHours(currentHour);

          if (currentMinutes < 30) {
            currentDate.setMinutes(30, 0, 0);
          } else {
            currentDate.setHours(currentHour + 1, 0, 0, 0);
          }
        }
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];

      // ==================================
      // CREATE 30-MINUTE SLOTS
      // ==================================

      while (currentDate < endTime) {
        // ----------------------------------
        // CREATE SLOT DATE
        // Example: 9_8_2026
        // ----------------------------------

        const slotDate =
          currentDate.getDate() +
          "_" +
          (currentDate.getMonth() + 1) +
          "_" +
          currentDate.getFullYear();

        // ----------------------------------
        // CREATE SLOT TIME
        // Example: 10:00 AM
        // ----------------------------------

        const slotTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // ==================================
        // GET BOOKED SLOTS
        // ==================================

        const bookedSlots = docInfo.slots_booked?.[slotDate] || [];

        // ==================================
        // CHECK WHETHER SLOT IS BOOKED
        // ==================================

        const isSlotBooked = bookedSlots.includes(slotTime);

        // ==================================
        // HIDE BOOKED SLOT
        // ==================================

        if (!isSlotBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: slotTime,
          });
        }

        // ----------------------------------
        // MOVE 30 MINUTES FORWARD
        // ----------------------------------

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlot(allSlots);

    // ----------------------------------
    // If selected day has no slots,
    // move automatically to next day.
    // ----------------------------------

    const firstAvailableDay = allSlots.findIndex(
      (slots) => slots.length > 0
    );

    if (firstAvailableDay !== -1 && allSlots[slotIndex]?.length === 0) {
      setSlotIndex(firstAvailableDay);
      setSlotTime("");
    }
  };

  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================

  const bookAppointment = async () => {
    // ----------------------------------
    // USER MUST LOGIN
    // ----------------------------------

    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    // ----------------------------------
    // TIME MUST BE SELECTED
    // ----------------------------------

    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      // ----------------------------------
      // GET SELECTED SLOT
      // ----------------------------------

      const selectedSlot = docSlot[slotIndex]?.find(
        (slot) => slot.time === slotTime
      );

      if (!selectedSlot) {
        toast.error("Invalid time slot");
        return;
      }

      const date = selectedSlot.datetime;

      // ----------------------------------
      // CREATE SLOT DATE
      // ----------------------------------

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      // ----------------------------------
      // DOUBLE CHECK SLOT IS NOT BOOKED
      // ----------------------------------

      const bookedSlots = docInfo.slots_booked?.[slotDate] || [];

      if (bookedSlots.includes(slotTime)) {
        toast.error("This time slot has already been booked.");

        // Refresh doctor data
        await getDoctorsData();

        return;
      }

      // ----------------------------------
      // SEND REQUEST TO BACKEND
      // ----------------------------------

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        {
          docId,
          slotDate,
          slotTime,
        },
        {
          headers: {
            token,
          },
        }
      );

      // ----------------------------------
      // SUCCESS
      // ----------------------------------

      if (data.success) {
        toast.success(data.message);

        // Refresh doctor information
        await getDoctorsData();

        // Clear selected time
        setSlotTime("");

        // Go to appointments
        navigate("/my-appointments");
      } else {
        toast.error(data.message);

        // Refresh in case another user
        // booked the slot at the same time
        await getDoctorsData();
      }
    } catch (error) {
      console.log("BOOK APPOINTMENT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  // ==========================================
  // FIND DOCTOR
  // ==========================================

  useEffect(() => {
    if (doctors && doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  // ==========================================
  // GENERATE SLOTS
  // ==========================================

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  // ==========================================
  // DEBUG
  // ==========================================

  useEffect(() => {
    console.log("AVAILABLE SLOTS:", docSlot);
  }, [docSlot]);

  // ==========================================
  // UI
  // ==========================================

  return (
    docInfo && (
      <div className="max-w-6xl mx-auto px-4">
        {/* ================================= */}
        {/* DOCTOR INFORMATION */}
        {/* ================================= */}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Doctor Image */}

          <div>
            <img
              className="bg-[#5f6FFF] w-full md:w-72 rounded-lg"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          {/* Doctor Details */}

          <div className="flex-1 border border-gray-200 rounded-lg p-8">
            <h1 className="text-2xl font-semibold text-gray-800">
              {docInfo.name}
            </h1>

            <p className="text-gray-600 mt-2">
              {docInfo.degree} - {docInfo.speciality}
            </p>

            <p className="text-gray-600 mt-1">
              Experience: {docInfo.experience}
            </p>

            {/* About */}

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-5">
                About

                <img
                  className="w-4"
                  src={assets.info_icon}
                  alt=""
                />
              </p>

              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            {/* Fees */}

            <p className="text-gray-500 font-medium mt-4">
              Appointment fees:

              <span className="text-gray-600">
                {" "}
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* ================================= */}
        {/* SELECT DAY */}
        {/* ================================= */}

        <div className="mt-8">
          <p className="text-gray-700 font-medium">
            Select Day
          </p>

          <div className="flex items-center gap-3 w-full overflow-x-auto mt-4">
            {docSlot.length > 0 &&
              docSlot.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime("");
                  }}
                  className={`
                    text-center
                    py-6
                    min-w-16
                    rounded-full
                    cursor-pointer
                    ${
                      slotIndex === index
                        ? "bg-[#5f6FFF] text-white"
                        : "border border-gray-200"
                    }
                  `}
                >
                  <p>
                    {item[0] &&
                      daysOfWeek[
                        item[0].datetime.getDay()
                      ]}
                  </p>

                  <p>
                    {item[0] &&
                      item[0].datetime.getDate()}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* ================================= */}
        {/* SELECT TIME */}
        {/* ================================= */}

        <div className="mt-6">
          <p className="text-gray-700 font-medium">
            Available Time
          </p>

          <div className="flex items-center gap-3 w-full overflow-x-auto mt-4">
            {docSlot[slotIndex]?.length > 0 ? (
              docSlot[slotIndex].map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`
                    px-5
                    py-2
                    rounded-full
                    whitespace-nowrap
                    cursor-pointer
                    ${
                      slotTime === item.time
                        ? "bg-[#5f6FFF] text-white"
                        : "border border-gray-300 text-gray-700"
                    }
                  `}
                >
                  {item.time}
                </button>
              ))
            ) : (
              <p className="text-red-500">
                No time slots available.
              </p>
            )}
          </div>
        </div>

        {/* ================================= */}
        {/* BOOK BUTTON */}
        {/* ================================= */}

        <button
          onClick={bookAppointment}
          className="bg-[#5f6FFF] text-white px-10 py-3 rounded-full mt-8 cursor-pointer hover:bg-[#4f5ee8]"
        >
          Book Appointment
        </button>

        {/* ================================= */}
        {/* RELATED DOCTORS */}
        {/* ================================= */}

        <RelatedDoctor
          speciality={docInfo.speciality}
          docId={docId}
        />
      </div>
    )
  );
};

export default Appointment;