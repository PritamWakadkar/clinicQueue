import express from 'express'
import { appointmentCanceled, appointmentCompleted, appointmentDoctor, doctorDashboard, doctorList, doctorprofile, loginDoctor, updateDoctorProfile } from '../controllers/doctor.controller.js'
import authDoc from '../middelwares/authDoc.js'


const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoc,appointmentDoctor)
doctorRouter.post('/cancel-appointment' , authDoc,appointmentCanceled)
doctorRouter.post('/appointment-completed',authDoc,appointmentCompleted)
doctorRouter.get('/dashboard',authDoc,doctorDashboard)
doctorRouter.get('/doctor-profile',authDoc,doctorprofile)
doctorRouter.post('/update-profile',authDoc,updateDoctorProfile)


export default doctorRouter             