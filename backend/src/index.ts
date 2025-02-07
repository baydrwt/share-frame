import express, { urlencoded } from "express";
const app = express();
import cors from "cors";
import connectDb from "./config/db";
import dotenv from "dotenv";
import routes from "./route/index";
import passportJwtStrategy from "./config/passportJwtStrategy";

dotenv.config();
connectDb();

// Updated CORS configuration with explicit credentials handling
const corsOptions = {
  origin: function (origin: any, callback: any) {
    const allowedOrigins = ["https://share-frame.vercel.app", "http://localhost:5173"];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS middleware first
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(passportJwtStrategy.initialize());

// Routes
app.use("/api/v1", routes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
