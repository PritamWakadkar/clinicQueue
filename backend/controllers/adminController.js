import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'
// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            available
        } = req.body;

        const imageFile = req.file;

        // Check required fields
        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !about ||
            !fees ||
            !address ||
            !imageFile ||
            !available
        ) {
            return res.json({
                success: false,
                message: "Missing Details",
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Enter a valid email",
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password should be at least 8 characters",
            });
        }

        // Check if doctor already exists
        const doctorExists = await doctorModel.findOne({ email });

        if (doctorExists) {
            return res.json({
                success: false,
                message: "Doctor already exists",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image
        const imageUpload = await cloudinary.uploader.upload(
            imageFile.path,
            {
                resource_type: "image",
            }
        );

        const imageUrl = imageUpload.secure_url;

        // Parse address safely
        let parsedAddress;

        try {
            parsedAddress = JSON.parse(address);
        } catch (err) {
            return res.json({
                success: false,
                message: "Invalid address format",
            });
        }

        // Create doctor object
        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: parsedAddress,
            available: true,
            date: Date.now(),
        };

        // Save doctor
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({
            success: true,
            message: "Doctor Added Successfully",
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: error.message,
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
                 email+password,              // Payload
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


export { addDoctor,loginAdmin };