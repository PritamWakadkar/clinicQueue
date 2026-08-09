import doctorModel from "../models/doctorModel.js";

const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body;

        // Find doctor
        const docData = await doctorModel.findById(docId);

        if (!docData) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }
        // Update availability
        await doctorModel.findByIdAndUpdate(docId, {
            availablity: !docData.availablity
        });

        res.json({
            success: true,
            message: "Availablity changed"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};


const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel
            .find({})
            .select(["-password", "-email"]);
        
        return res.json({
            success: true,
            doctors
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
    };


export { changeAvailablity,doctorList };