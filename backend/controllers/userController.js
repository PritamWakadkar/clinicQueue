
import "dotenv/config";
import Razorpay from "razorpay";

import validator from "validator";
import bycrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudnary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API to rgister user

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "missing value",
      });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "invalid email" });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "enter the strong password" });
    }

    // hashing user password
    const salt = await bycrypt.genSalt(12);
    const hashPassword = await bycrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
    );

    return res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "user does not exist",
      });
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (isMatch) {
      const token = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
      );
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get user profile data

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to update user profile

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const { name, phone, address, dob, gender } = req.body;

    const imageFile = req.file;

    // Check required fields
    if (!name || !phone || !dob || !gender) {
      return res.json({
        success: false,
        message: "Data missing",
      });
    }

    // Parse address
    let parsedAddress;

    try {
      parsedAddress =
        typeof address === "string" ? JSON.parse(address) : address;
    } catch (error) {
      return res.json({
        success: false,
        message: "Invalid address format",
      });
    }

    // Update profile data
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    // Upload image if selected
    if (imageFile) {
      const imageUpload = await cloudnary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, {
        image: imageURL,
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to book the appointment

const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;

    const userId = req.userId;

    // Find doctor
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check doctor availability
    if (!docData.availablity) {
      return res.json({
        success: false,
        message: "Doctor not available",
      });
    }

    let slots_booked = docData.slots_booked || {};

    // Check slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot not available",
        });
      }

      slots_booked[slotDate].push(slotTime);
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    // Get user
    const userData = await userModel.findById(userId).select("-password");

    console.log(userData);

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Remove slots_booked from doctor data
    delete docData.slots_booked;

    // Appointment data
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    // Save appointment
    const newAppointment = new appointmentModel(appointmentData);

    await newAppointment.save();

    // Update doctor's booked slots
    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked,
    });

    return res.json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log("BOOK APPOINTMENT ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get user appointment for frontend my-appointment page

const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;

    console.log("USER ID:", userId);

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID not found",
      });
    }

    const appointments = await appointmentModel.find({
      userId: userId,
    });

    return res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log("LIST APPOINTMENT ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to cancle appointment

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    // ==========================================
    // CHECK USER
    // ==========================================

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

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
    // CHECK APPOINTMENT OWNER
    // ==========================================

    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized action",
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

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
 
//  API to make payment of appointment using razorpay

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment canceled or not found",
      });
    }

    // creating options for razorpay payment

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // creation of an order

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order});
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to verfy the payment

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        if (!razorpay_order_id) {
            return res.json({
                success: false,
                message: "Razorpay order ID is required",
            });
        }

        const orderInfo = await razorpayInstance.orders.fetch(
            razorpay_order_id
        );

        if (orderInfo.status === "paid") {
            await appointmentModel.findByIdAndUpdate(
                orderInfo.receipt,
                { payment: true }
            );

            return res.json({
                success: true,
                message: "Payment successful",
            });
        } else {
            return res.json({
                success: false,
                message: "Payment failed",
            });
        }
    } catch (error) {
        console.log("Verify Razorpay Error:", error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export {
  userRegister,
  userLogin,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay
};
