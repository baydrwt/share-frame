import dotenv from "dotenv";
import path from "path";
dotenv.config();

import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "private",
    metadata(req, file, callback) {
      callback(null, { fieldname: file.fieldname });
    },
    key: function (req, file, callback) {
      const folder = "share-frame";
      const extension = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, extension);
      const fileName = `${baseName}-${Date.now()}-${file.fieldname}${extension}`;
      const filePath = `${folder}/${fileName}`;
      callback(null, filePath);
    },
  }),
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);
