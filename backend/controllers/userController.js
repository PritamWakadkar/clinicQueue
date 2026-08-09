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

        const {
            docId,
            slotDate,
            slotTime
        } = req.body;

        const userId = req.userId

        // Find doctor
        const docData = await doctorModel
            .findById(docId)
            .select("-password");

        if (!docData) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }

        // Check doctor availability
        if (!docData.availablity) {
            return res.json({
                success: false,
                message: "Doctor not available"
            });
        }

        let slots_booked = docData.slots_booked || {};

        // Check slot availability
        if (slots_booked[slotDate]) {

            if (slots_booked[slotDate].includes(slotTime)) {

                return res.json({
                    success: false,
                    message: "Slot not available"
                });

            }

            slots_booked[slotDate].push(slotTime);

        } else {

            slots_booked[slotDate] = [slotTime];

        }

        // Get user
        const userData = await userModel
            .findById(userId)
            .select("-password");

            console.log(userData);
            
        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
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
            date: Date.now()
        };

        // Save appointment
        const newAppointment =
            new appointmentModel(appointmentData);

        await newAppointment.save();

        // Update doctor's booked slots
        await doctorModel.findByIdAndUpdate(
            docId,
            {
                slots_booked
            }
        );

        return res.json({
            success: true,
            message: "Appointment booked successfully"
        });

    } catch (error) {

        console.log("BOOK APPOINTMENT ERROR:", error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};
export { userRegister, userLogin, getProfile, updateProfile ,bookAppointment};
