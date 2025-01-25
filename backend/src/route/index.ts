import express from "express";
import authRouter from "./authRoute";
import userRoute from "./userRoute";
import passport from "passport";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", passport.authenticate("jwt", { session: false }), userRoute);

export default router;
