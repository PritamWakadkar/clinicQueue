import mongoose from "mongoose";

async function connectDB(){
   await  mongoose.connect(process.env.MONGOOSE_URL)
   console.log("database Connected");
   
}

export default connectDB;