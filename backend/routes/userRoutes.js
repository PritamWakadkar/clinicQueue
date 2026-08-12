import express from 'express'

import { bookAppointment, cancelAppointment, getProfile, listAppointment, paymentRazorpay, updateProfile, userLogin, userRegister, verifyRazorpay} from '../controllers/userController.js'
import authUser from '../middelwares/authUser.js'
import upload from '../middelwares/multter.js'



const userRouter = express.Router()

userRouter.post('/register' , userRegister)
userRouter.post('/login' , userLogin)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointment',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)

export default userRouter