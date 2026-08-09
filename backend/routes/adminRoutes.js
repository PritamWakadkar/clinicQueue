import express from 'express'
import { addDoctor, AllDoctors, loginAdmin } from '../controllers/adminController.js'
import upload from '../middelwares/multter.js'
import authAdmin from '../middelwares/authAdmin.js'
import { changeAvailablity } from '../controllers/doctor.controller.js'


const addminRouter = express.Router()

addminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
addminRouter.post('/login',loginAdmin)
addminRouter.post('/all-doctors',authAdmin,AllDoctors)
addminRouter.post('/change-availablity',authAdmin,changeAvailablity)

export default addminRouter