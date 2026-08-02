import express from 'express'
import { addDoctor, loginAdmin } from '../controllers/adminController.js'
import upload from '../middelwares/multter.js'
import authAdmin from '../middelwares/authAdmin.js'


const addminRouter = express.Router()

addminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
addminRouter.post('/login',loginAdmin)

export default addminRouter