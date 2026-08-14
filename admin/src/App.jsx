
import React, { useContext } from 'react'
import Login from './pages/Login' 
  import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointment from './pages/Admin/AllAppointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';


 const App = () => {

  const {token} =useContext(AdminContext)
  const {dtoken} = useContext(DoctorContext)

   return token || dtoken? (
     <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* ------Admin ROute ------- */}
           <Route path='/' element={<></>}/>
           <Route path='/admin-dashboard' element={<Dashboard />} />
           <Route path='/all-appointment' element={<AllAppointment />} />
           <Route path='/add-doctor' element={<AddDoctor />} />
           <Route path='/doctor-list' element={<DoctorsList />} />

          {/* -----Doctor Route------ */}
          <Route path='/doctor-appointment' element={<DoctorAppointment />}/>
          <Route path='/doctor-dashboard' element={<DoctorDashboard />}/>
          <Route path='/doctor-profile' element={<DoctorProfile />}/>
        
        </Routes>
      </div>
     </div>
   ):(
    <>
     <Login />
      <ToastContainer />
    </>
   )
 }
 
 export default App