import express from "express";
const router = express.Router();
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../db";
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

cloudinary.config({
  cloud_name: "ddwapzxdc",
  api_key: "622526376528128",
  api_secret: "hjuus8X3RczPHUlpy0RW46RtRFc",
  secure: true,
});
export const uploadQuestionImg = (questionImg, req, res) => {
  upload.single("image"),
    (req, res) => {
      if (req.file) {
        cloudinary.uploader
          .upload(req.file.path, {
            folder: "BankQuestion",
            resource_type: "image",
          })
          .then((result) => {})
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              success: false,
              message: "Error",
            });
          });
      } else {
      }
    };
};
