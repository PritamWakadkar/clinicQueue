import express from 'express'

import { bookAppointment, getProfile, updateProfile, userLogin, userRegister} from '../controllers/userController.js'
import authUser from '../middelwares/authUser.js'
import upload from '../middelwares/multter.js'



const userRouter = express.Router()

userRouter.post('/register' , userRegister)
userRouter.post('/login' , userLogin)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)

export default userRouter