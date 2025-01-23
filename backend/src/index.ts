import express, { urlencoded } from "express";
const app = express();
import connectDb from "./config/db";
import dotenv from "dotenv";
import routes from "./route/index";
import passportJwtStrategy from "./config/passportJwtStrategy";

dotenv.config();
connectDb();

app.use(passportJwtStrategy.initialize());

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/api/v1", routes);
app.listen(port, () => {
  console.log(`server are running on port ${port}`);
});
