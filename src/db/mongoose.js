import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection_URL =
  "mongodb+srv://admin:xFpjqY64wrN86Ko8@cluster0.cxza5.mongodb.net/interview-admin-dashboard";


//function for checking database connection
const connectToMongo = async () => {
  try {
    await mongoose.connect(connection_URL, {
      useNewUrlParser: true,
      autoIndex: true,
      useUnifiedTopology: true,
    });
    console.log("connected to mongo successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;


//xFpjqY64wrN86Ko8
