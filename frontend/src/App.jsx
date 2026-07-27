 import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Doctor from './pages/Doctors'
import Login from './pages/Login'
import Myappointent from './pages/Myappointent'
import MyProfile from './pages/MyProfile'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
 
 const App = () => {
   return (
     <div className='mx-4 sm:max-[10%]'>
      <Navbar />
    <Routes>

      <Route path='/' element={<Home />}/>
      <Route path='/about' element={<About />}/>
      <Route path='/contact' element={<Contact />} />
      <Route path='/doctors' element={<Doctor />} />
      <Route path='/doctors/:speciality' element={<Doctor />} />
      <Route path='/login' element={<Login />} />
      <Route path='/my-appointments' element={<Myappointent />} />
      <Route path='/my-profile' element={<MyProfile/>} />
      <Route path='/appointment/:docId' element={<Appointment />} />
    </Routes>
    <Footer />
     </div>
   )
 }
 
 export default App