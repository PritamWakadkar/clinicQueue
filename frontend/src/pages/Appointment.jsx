import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets/assets_frontend/assets'
import RelatedDoctor from '../components/RelatedDoctor'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  
  const {docId} = useParams()
  const {doctors,currencySymbol ,backendUrl,getDoctorsData,token} = useContext(AppContext)
  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']
 const navigate = useNavigate()
  const [docInfo , setDocInfo] = useState(null)
  const [docSlot,setDocSlot] =useState([])
  const [slotIndex, setslotINdex] = useState(0)
  const [slotTime, setslotTime] = useState('')

  const fetcgDocInfo = async ()=>{
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo);
    
  }

 const getAvailableSlots = async () => {

    let allSlots = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {

        // Current day
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        // End time (9:00 PM)
        let endTime = new Date(today);
        endTime.setDate(today.getDate() + i);
        endTime.setHours(21, 0, 0, 0);

        // Starting time
        if (i === 0) {
            currentDate.setHours(
                currentDate.getHours() > 10
                    ? currentDate.getHours() + 1
                    : 10
            );

            currentDate.setMinutes(
                currentDate.getMinutes() > 30 ? 30 : 0
            );

            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);
        } else {
            currentDate.setHours(10, 0, 0, 0);
        }

        let timeSlots = [];

        while (currentDate < endTime) {

            timeSlots.push({
                datetime: new Date(currentDate),
                time: currentDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });

            currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        allSlots.push(timeSlots);
    }

    setDocSlot(allSlots);
};

const bookAppointment = async ()=>{
  if(!token){
    toast.warn('Login to book appointment')
    return navigate('/login')
  }
 
  try {
     
    const date = docSlot[slotIndex][0].datetime

    let day = date.getDate()
    let month = date.getMonth()+1
    let year = date.getFullYear()

     const slotDate = day+"_"+month+"_"+year

     const {data} = await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})
     
     if (data.success) {
      toast.success(data.message)
      getDoctorsData()
      navigate('/my-appointments')
     }else{
      toast.error(data.message)
     }

  } catch (error) {
    console.log(error);
    toast.error(error.message)
    
  }

}

  useEffect(()=>{
    fetcgDocInfo()
  },[doctors,docId])
 
  useEffect(() => {
    if (docInfo) {
        getAvailableSlots();
    }
}, [docInfo]);
  

  useEffect(()=>{
    console.log(docSlot);
    
  },[docSlot])
  
  return docInfo && (
    <div  >
      {/* --------Doctor details ---------- */}
       <div className='flex flex-col sm:flex-row gap-9 '>
        <div>
          <img className='bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* ---------------- doc info :nme ,deg, experiance --------------- */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full '>{docInfo.experience}</button>
          </div>

          {/* dictor about */}
        <div>
          <p className='flex flex-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
          <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>

        </div>
        <p className='text-gray-500 font-medium mt-4'>
          Appointment fees: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
        </p> 
        </div>
       </div>

       {/* --------booking slots -------------- */}
<div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
    <p>Booking Slots</p>

    <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>

        {docSlot.length > 0 &&
            docSlot.map((item, index) => (

                <div
                    key={index}
                    onClick={() => setslotINdex(index)}
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                        slotIndex === index
                            ? "bg-[#5f6FFF] text-white"
                            : "border border-gray-200"
                    }`}
                >

                    <p>{item[0] && daysOfWeek[item[0]?.datetime.getDay()]}</p>

                    <p>{item[0] && item[0]?.datetime.getDate()}</p>

                </div>

            ))
        }

    </div>
   <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
  {docSlot.length > 0 &&
    docSlot[slotIndex] &&
    docSlot[slotIndex].map((item, index) => (
      <p
        key={index}
        onClick={() => setslotTime(item.time)}
        className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
          item.time === slotTime
            ? "bg-[#5f6FFF] text-white"
            : "text-gray-400 border border-gray-300"
        }`}
      >
        {item.time.toLowerCase()}
      </p>
    ))}
</div>
<button onClick={bookAppointment} className='bg-[#5f6FFF] text-white text-sm border rounded-full font-light px-14 py-3 my-6'>Book an appointment</button>
</div>
 {/* -------------- listing related doctors-------------- */}
 <RelatedDoctor docId={docId} speciality = {docInfo.speciality} />
    </div>
  )
}

export default Appointment