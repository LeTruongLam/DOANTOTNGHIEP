import express from "express";
const router = express.Router();
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { db } from "../db.js";
import { updateLessonVideo } from "../controllers/Course/lesson.js";
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

router.post("/uploadVideo", upload.single("video"), (req, res) => {
  const { chapterTitle, chapterDesc, courseId } = req.body;
  let videoUrl = "";

  if (req.file) {
    cloudinary.uploader
      .upload(req.file.path, { folder: "CourseVideo", resource_type: "video" })
      .then((result) => {
        videoUrl = result.url;
        insertChapterData(chapterTitle, chapterDesc, videoUrl, courseId, res);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Error",
        });
      });
  } else {
    insertChapterData(chapterTitle, chapterDesc, videoUrl, courseId, res);
  }
});

router.put(
  "/:chapterId/uploadLessonVideo/:lessonId",
  upload.single("video"),
  (req, res) => {
    const { chapterId, lessonId } = req.params;
    console.log(chapterId);
    console.log(lessonId);
    let lessonVideo = "";

    if (req.file) {
      cloudinary.uploader
        .upload(req.file.path, {
          folder: "CourseVideo",
          resource_type: "video",
        })
        .then((result) => {
          lessonVideo = result.url;
          updateLessonVideo(lessonVideo, chapterId, lessonId, req, res);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: "Error",
          });
        });
    } else {
      lessonVideo = req.body.videoUrl
      updateLessonVideo(lessonVideo, chapterId, lessonId, req, res);
    }
  }
);

function insertChapterData(chapterTitle, chapterDesc, videoUrl, courseId, res) {
  const query = `INSERT INTO Chapters (ChapterTitle, ChapterDesc, ChapterVideo, CourseId) VALUES (?, ?, ?, ?)`;

  db.query(
    query,
    [chapterTitle, chapterDesc, videoUrl, courseId],
    (err, result) => {
      if (err) {
        console.error("Error inserting chapter data into database: ", err);
        res.status(500).json({
          success: false,
          message: "Error",
        });
      } else {
        console.log("Chapter data inserted into database");
        res.status(201).json({
          success: true,
          message: "Uploaded!",
          data: result,
        });
      }
    }
  );
}

router.put("/updateChapter/:chapterId", upload.single("video"), (req, res) => {
  const chapterId = req.params.chapterId;
  const { chapterTitle, chapterDesc } = req.body;
  const videoUrl = req.file && req.file.path; // Assuming the uploaded video is stored as a file path

  const updateChapterQuery = `
    UPDATE Chapters
    SET ChapterTitle = ?,
        ChapterDesc = ?,
        ChapterVideo = ?
    WHERE ChapterId = ?
  `;

  db.query(
    updateChapterQuery,
    [chapterTitle, chapterDesc, videoUrl, chapterId],
    (err, result) => {
      if (err) {
        console.error("Error updating chapter data in the database: ", err);
        res.status(500).json({
          success: false,
          message: "Error",
        });
      } else {
        console.log("Chapter data updated in the database");
        res.status(200).json({
          success: true,
          message: "Chapter updated!",
          data: result,
        });
      }
    }
  );
});

router.post("/uploadImage", upload.single("image"), (req, res) => {
  if (req.file) {
    cloudinary.uploader
      .upload(req.file.path, { folder: "CourseImage" })
      .then((result) => {
        const imageUrl = result.url;
        res.status(201).json({
          success: true,
          message: "Image uploaded!",
          imageUrl: imageUrl,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Error",
        });
      });
  } else {
    res.status(400).json({
      success: false,
      message: "No image file provided",
    });
  }
});

function insertChapterDocument(chapterDocument, chapterId, documentName, res) {
  const query = `    INSERT INTO documents (ChapterId, DocumentName , DocumentUrl)
  VALUES (?, ?, ?);`;

  db.query(query, [chapterId, documentName, chapterDocument], (err, result) => {
    if (err) {
      console.error("Error inserting document data into database: ", err);
      res.status(500).json({
        success: false,
        message: "Error",
      });
    } else {
      console.log("Document data inserted into database");
      res.status(201).json({
        success: true,
        message: "Document uploaded!",
        data: result,
      });
    }
  });
}

router.post(
  "/uploadDocument/:chapterId",
  upload.single("document"),
  (req, res) => {
    if (req.file) {
      cloudinary.uploader
        .upload(req.file.path, {
          folder: "CourseDocument",
          resource_type: "raw",
        })
        .then((result) => {
          const documentName = result.original_filename;
          const chapterDocument = result.url;
          const chapterId = req.params.chapterId;
          insertChapterDocument(chapterDocument, chapterId, documentName, res); // Gọi hàm insertChapterDocument để chèn dữ liệu
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: "Error",
          });
        });
    } else {
      res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }
  }
);

export default router;
