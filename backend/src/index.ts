import express, { urlencoded } from "express";
const app = express();
import connectDb from "./config/db";
import dotenv from "dotenv";
import routes from "./route/index";

dotenv.config();

const port = process.env.PORT || 8080;

connectDb();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/api/v1", routes);
app.listen(port, () => {
  console.log(`server are running on port ${port}`);
});
