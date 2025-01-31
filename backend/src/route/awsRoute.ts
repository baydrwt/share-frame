import express from "express";
import { upload } from "../middleware/multers3Middleware";
import { uploadFile } from "../controller/aws/awsFileController";
const router = express.Router();

router.post("/uplod-file", upload, uploadFile);

export default router;
