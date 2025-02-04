import express from "express";
import { upload } from "../middleware/multers3Middleware";
import { deleteVideo, fetchSingleVideo, fetchVideos, updateVideo, uploadFile } from "../controller/aws/awsFileController";
const router = express.Router();

router.post("/upload-file", upload, uploadFile);
router.get("/fetch-videos", fetchVideos);
router.get("/fetch-single/:id", fetchSingleVideo);
router.delete("/delete-single/:id", deleteVideo);
router.put("/update-video/:id", upload, updateVideo);

export default router;
