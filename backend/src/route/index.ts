import express from "express";
import authRouter from "./authRoute";

const router = express.Router();

router.use("/auth", authRouter);

export default router;
