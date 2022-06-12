import express from "express";
import cors from "cors";
import connectToMongo from "./db/mongoose.js";
import userRouters from "./routes/users.js";
import productRouters from "./routes/products.js";
import dotenv from "dotenv";

dotenv.config();
connectToMongo();
const port = process.env.port || 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouters); //passing userRouters in app
app.use("/api/products", productRouters); //passing productRouters in app

app.listen(port, () => {
  console.log(`backend server is running on localhost port: ${port}`);
});
