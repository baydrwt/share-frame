import express from "express";
import authRoute from "./authRoute";
import userRoute from "./userRoute";
import awsRoute from "./awsRoute";
import passport from "passport";
import { downloadVideo, fetchSingleVideo, fetchVideos } from "../controller/aws/awsFileController";

const router = express.Router();

router.get("/fetch-videos", fetchVideos);
router.get("/fetch-single/:id", fetchSingleVideo);
router.use("/auth", authRoute);
router.get("/download/file/:id", downloadVideo);
router.use("/user", passport.authenticate("jwt", { session: false }), userRoute);
router.use("/aws", passport.authenticate("jwt", { session: false }), awsRoute);

export default router;
