import express from "express";
const router = express.Router();
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import {db} from "../db.js"

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
      const videoUrl = result.url;
      const query = `INSERT INTO Images (url) VALUES (?)`; // Đảm bảo tên bảng là "Videos" chứ không phải "Images"

      db.query(query, [videoUrl], (err, result) => {
        if (err) {
          console.error("Error inserting video URL into database: ", err);
          res.status(500).json({
            success: false,
            message: "Error",
          });
        } else {
          console.log("Video URL inserted into database");
          res.status(201).json({
            success: true,
            message: "Uploaded!",
            data: result,
          });
        }
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