import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDb = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error(`Error in connecting to database ${error}`);
  }
};

export default connectDb;
