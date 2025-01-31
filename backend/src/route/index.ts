import express from "express";
import authRoute from "./authRoute";
import userRoute from "./userRoute";
import awsRoute from "./awsRoute";
import passport from "passport";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", passport.authenticate("jwt", { session: false }), userRoute);
router.use("/aws", passport.authenticate("jwt", { session: false }), awsRoute);

export default router;
