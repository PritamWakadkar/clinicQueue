import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'


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


export { addDoctor,loginAdmin,AllDoctors };