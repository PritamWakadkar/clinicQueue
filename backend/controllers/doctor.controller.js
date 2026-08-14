import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    // Find doctor
    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }
    // Update availability
    await doctorModel.findByIdAndUpdate(docId, {
      availablity: !docData.availablity,
    });

    res.json({
      success: true,
      message: "Availablity changed",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// API to get doctor list
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    return res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = await jwt.sign(
        { id: doctor._id },
        process.env.JWT_SECRET_KEY,
      );

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get doctors appointment to doctor panel
const appointmentDoctor = async (req, res) => {
  try {
    const docId = req.docId;

    const appointment = await appointmentModel.find({ docId });

    res.json({ success: true, appointment });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to mark appointment completed for doctor panel
const appointmentCompleted = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    // Find appointment
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Appointment doesn't exist
    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check whether this appointment belongs to this doctor
    if (appointmentData.docId.toString() !== docId.toString()) {
      return res.json({
        success: false,
        message: "Not authorized to complete this appointment",
      });
    }

    // Mark appointment as completed
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    return res.json({
      success: true,
      message: "Appointment completed",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to mark appointments is cancelled
const appointmentCanceled = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    // Find appointment
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Check appointment exists
    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check appointment belongs to logged-in doctor
    if (appointmentData.docId.toString() !== docId.toString()) {
      return res.json({
        success: false,
        message: "You are not authorized to cancel this appointment",
      });
    }

    // Cancel appointment
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    return res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get dashBoard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;

    const appointments = await appointmentModel.find({ docId });

    let earning = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earning += item.amount;
      }
    });
    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earning,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointment: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor profile for doctor panel

const doctorprofile = async (req, res) => {
  try {
    const docId = req.docId;

    const profileData = await doctorModel
      .findById( docId )
      .select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: true, message: error.message });
  }
};

// API to update doctor profile data from the doctor panel

const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fees, address, availablity } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, availablity });

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentDoctor,
  appointmentCompleted,
  appointmentCanceled,
  doctorDashboard,
  doctorprofile,
  updateDoctorProfile
};
