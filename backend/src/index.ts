import express from "express";
const app = express();
import connectDb from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 8080;

connectDb();
app.listen(port, () => {
  console.log(`server are running on port ${port}`);
});
