import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";


const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            education,
            about,
            fees,
            address
        } = req.body;

        const imageFile = req.file;

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        // Check required fields
        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !education ||
            !about ||
            !fees ||
            !address ||
            !imageFile
        ) {
            return res.json({
                success: false,
                message: "Missing Details"
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Enter a valid email"
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password should be at least 8 characters"
            });
        }

        // Check doctor already exists
        const doctorExists = await doctorModel.findOne({
            email
        });

        if (doctorExists) {
            return res.json({
                success: false,
                message: "Doctor already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        // Upload image
        const imageUpload = await cloudinary.uploader.upload(
            imageFile.path,
            {
                resource_type: "image"
            }
        );

        const imageUrl = imageUpload.secure_url;

        // Parse address
        let parsedAddress;

        try {
            parsedAddress = JSON.parse(address);
        } catch (error) {
            return res.json({
                success: false,
                message: "Invalid address format"
            });
        }

        // Doctor data
        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            education,
            about,
            fees,
            address: parsedAddress,

            // New doctors are available by default
            available: true,

            date: Date.now()
        };

        // Create doctor
        const newDoctor = new doctorModel(
            doctorData
        );

        await newDoctor.save();

        return res.json({
            success: true,
            message: "Doctor Added Successfully"
        });

    } catch (error) {
        console.log("ADD DOCTOR ERROR:", error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};



// API for admin login


const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(
                 email+password,               
                process.env.JWT_SECRET_KEY
            );

            res.cookie("token",token)

            return res.json({
                success: true,
                token,
            });
        }

        return res.json({
            success: false,
            message: "Invalid Credentials",
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// api to get all otors list for admin panel

const AllDoctors = async (req,res)=>{

    try {

        const doctors = await doctorModel.find({}).select('-password')  
        res.json({success:true,doctors})

    } catch (error) {
         console.log(error);

        return res.json({
            success: false,
            message: error.message,
        }); 
    }
}


// api to get all appointments list
const appointmentsAdmin = async (req,res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        }); 
    }
}


// To cancle the appointment for admin

const appointmentCancel = async (req, res) => {
  try {
   
    const { appointmentId } = req.body;
 
    // ==========================================
    // CHECK APPOINTMENT ID
    // ==========================================

    if (!appointmentId) {
      return res.json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    // ==========================================
    // FIND APPOINTMENT
    // ==========================================

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    

    // ==========================================
    // CHECK ALREADY CANCELLED
    // ==========================================

    if (appointmentData.cancelled === true) {
      return res.json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    // ==========================================
    // GET APPOINTMENT INFORMATION
    // ==========================================

    const docId = appointmentData.docId;
    const slotDate = appointmentData.slotDate;
    const slotTime = appointmentData.slotTime;

    console.log("=================================");
    console.log("CANCEL APPOINTMENT");
    console.log("Doctor ID:", docId);
    console.log("Slot Date:", slotDate);
    console.log("Slot Time:", slotTime);
    console.log("=================================");

    // ==========================================
    // FIND DOCTOR
    // ==========================================

    const doctorData = await doctorModel.findById(docId);

    if (!doctorData) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    // ==========================================
    // GET CURRENT BOOKED SLOTS
    // ==========================================

    const currentSlotsBooked = doctorData.slots_booked || {};

    console.log("BEFORE:", JSON.stringify(currentSlotsBooked, null, 2));

    // ==========================================
    // CHECK DATE
    // ==========================================

    if (currentSlotsBooked[slotDate]) {
      // Create new array without cancelled time

      const updatedSlots = currentSlotsBooked[slotDate].filter(
        (time) => time !== slotTime,
      );

      // ======================================
      // UPDATE DATE
      // ======================================

      if (updatedSlots.length > 0) {
        currentSlotsBooked[slotDate] = updatedSlots;
      } else {
        // No appointments left for this date
        delete currentSlotsBooked[slotDate];
      }
    } else {
      console.log("No booked slots found for date:", slotDate);
    }

    // ==========================================
    // SAVE UPDATED DOCTOR
    // ==========================================

    doctorData.slots_booked = currentSlotsBooked;

    doctorData.markModified("slots_booked");

    await doctorData.save();

    console.log("AFTER:", JSON.stringify(doctorData.slots_booked, null, 2));

    // ==========================================
    // MARK APPOINTMENT AS CANCELLED
    // ==========================================

    appointmentData.cancelled = true;

    await appointmentData.save();

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.json({
      success: true,

      message: "Appointment cancelled",
    });
  } catch (error) {
    console.log("CANCEL APPOINTMENT ERROR:", error);

    return res.json({
      success: false,

      message: error.message,
    });
  }
}; 

// API to dashbord data for admin pannel

const adminDashbord = async (req,res)=>{

    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        
        
        const dashData ={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})
    } catch (error) {
         console.log("CANCEL APPOINTMENT ERROR:", error);

    return res.json({
      success: false,

      message: error.message,
    });
    }

}


export { addDoctor,loginAdmin,AllDoctors,appointmentsAdmin,appointmentCancel,adminDashbord };