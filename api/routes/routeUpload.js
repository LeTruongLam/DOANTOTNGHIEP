import express from "express";
const router = express.Router();
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage });

cloudinary.config({ 
  cloud_name: 'ddwapzxdc', 
  api_key: '622526376528128', 
  api_secret: 'hjuus8X3RczPHUlpy0RW46RtRFc',
  secure: true,
});

router.post("/uploadVideo", upload.single("video"), (req, res) => {
  cloudinary.uploader
    .upload(
      req.file.path,
      { folder: "CourseVideo", resource_type: "video" }
    )
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Uploaded!",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Error",
      });
    });
});

export default router;