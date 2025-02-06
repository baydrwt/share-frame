import { RequestHandler } from "express";
import dotenv from "dotenv";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";
import Video from "../../model/videoSchema";
import User from "../../model/userSchema";
import { sendResponse } from "../../utils/sendResponse";
import { Readable } from "stream";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const uploadFile: RequestHandler = async (req, res) => {
  try {
    if (req.files && (req.files as any).video) {
      let { title, description, isPrivate } = req.body;
      let baseName;
      const videoFile = (req.files as any).video[0];
      const thumbnailFile = (req.files as any).thumbnail ? (req.files as any).thumbnail[0] : null;

      if (!title) {
        const extension = path.extname(videoFile.originalname);
        baseName = path.basename(videoFile.originalname, extension);
      }

      if (req.user instanceof User) {
        if ("location" in videoFile) {
          if ("key" in videoFile) {
            const newVideo = await Video.create({
              title: title || baseName,
              description: description ? description : undefined,
              uploadedBy: req.user._id,
              path: videoFile.location,
              key: videoFile.key,
              isPrivate,
              thumbnail: thumbnailFile ? thumbnailFile.location : undefined,
            });
            const user = await User.findById(req.user._id);
            if (user) {
              user.uploadCount += 1;
              await user.save();
            }
            return sendResponse(res, 200, true, "Video uploaded successfully", {
              video: {
                _id: newVideo._id,
                path: newVideo.path,
                title: newVideo.title,
                description: newVideo.description,
                thumbnail: newVideo.thumbnail,
                uploadedBy: {
                  email: user?.email,
                },
                isPrivate: newVideo.isPrivate,
              },
            });
          }
          return sendResponse(res, 400, false, "Upload failed");
        }
        return sendResponse(res, 404, false, "Not authorized to upload the video");
      }
    }
  } catch (error) {
    console.error(`Error in uploading the video ${error}`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

export const fetchVideos: RequestHandler = async (req, res) => {
  try {
    const videos = await Video.find({ isPrivate: false }).sort({ createdAt: -1 }).populate("uploadedBy", "email");
    sendResponse(res, 200, true, "Fetch videos successfuly", { videos });
  } catch (error) {
    console.error(`Something went wrong ${error}`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

export const fetchSingleVideo: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 404, false, "Id not found");
    }
    const video = await Video.findById(id).populate("uploadedBy", "email");
    if (!video) {
      return sendResponse(res, 404, false, "Video not found");
    }
    sendResponse(res, 200, true, "Your video fetched successfully", { video });
  } catch (error) {
    console.error(`Something went wrong ${error}`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

export const deleteVideo: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 404, false, "Id not found");
    }
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return sendResponse(res, 404, false, "The video doesn't exist");
    }
    sendResponse(res, 200, true, "The video was deleted successfully");
  } catch (error) {
    console.error(`Something went wrong ${error}`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

export const downloadVideo: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!id) {
      return sendResponse(res, 404, false, "Id not found");
    }
    const video = await Video.findById(id);
    if (!video) {
      return sendResponse(res, 404, false, "The video doesn't exist");
    }
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: video.key,
    };
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.downloadCount += 1;
        await user.save();
      }
    }
    const command = new GetObjectCommand(params);
    const s3Response = await s3.send(command);
    const stream = s3Response.Body as Readable;
    res.setHeader("Content-Disposition", `attachment;filename${video.title}`);
    res.setHeader("Content-Type", s3Response.ContentType || "video/mp4");
    stream.pipe(res);
  } catch (error) {
    console.error(`Something went wrong ${error}`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

export const updateVideo: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 404, false, "Id not found");
    }
    const video = await Video.findById(id);
    if (!video) {
      return sendResponse(res, 404, false, "The video doesn't exist");
    }
    Object.assign(video, req.body);
    await video.save();

    if (req.files && (req.files as any).video) {
      const videoFile = (req.files as any).video[0];
      if ("location" in videoFile && "key" in videoFile) {
        video.path = videoFile.location;
        video.key = videoFile.key;
      }
    }

    if (req.files && (req.files as any).thumbnail) {
      const thumbnailFile = (req.files as any).thumbnail[0];
      if ("location" in thumbnailFile && "key" in thumbnailFile) {
        video.thumbnail = thumbnailFile.location;
      }
    }
    await video.save();
    return sendResponse(res, 200, true, "Video updated successfully", { video });
  } catch (error) {
    console.error(`Error in updating the video ${error}`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

export const fetchUserVideo: RequestHandler = async (req, res) => {
  try {
    if (req.user instanceof User) {
      const userId = req.user._id;
      if (!userId) {
        return sendResponse(res, 404, false, "User id not found");
      }
      const videos = await Video.find({ uploadedBy: userId }).populate("uploadedBy", "email");
      return sendResponse(res, 200, true, "Success fetch your video", { videos });
    }
  } catch (error) {
    console.error("Something went wrong");
    return sendResponse(res, 500, false, "Internal server error");
  }
};
