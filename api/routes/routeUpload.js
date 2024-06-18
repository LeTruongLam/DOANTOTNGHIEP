import express from "express";
const router = express.Router();
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import { db } from "../db.js";
import { updateLessonVideo } from "../controllers/Course/lesson.js";
import { updateAssignmentFile } from "../controllers/Course/assignment.js";
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
// Đăng video bài học
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

// Sửa video bài học
router.put(
  "/:chapterId/uploadLessonVideo/:lessonId",
  upload.single("video"),
  (req, res) => {
    const { chapterId, lessonId } = req.params;
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
      lessonVideo = req.body.videoUrl;
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

function updateCourseImage(courseId, imageUrl, res) {
  const query = "UPDATE courses SET `img` = ? WHERE `CourseId` = ?";
  db.query(query, [imageUrl, courseId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({
      success: true,
      message: "Image uploaded!",
      imageUrl: imageUrl,
    });
  });
}
router.post("/:courseId/uploadImage", upload.single("image"), (req, res) => {
  const courseId = req.params.courseId;
  if (req.file) {
    cloudinary.uploader
      .upload(req.file.path, { folder: "CourseImage" })
      .then((result) => {
        const imageUrl = result.url;
        updateCourseImage(courseId, imageUrl, res); // Di chuyển gọi hàm updateCourseImage vào đây
      })
      .catch((err) => {
        res.status(500).json(err);
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
      res.status(500).json({
        success: false,
        message: "Error",
      });
    } else {
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
// Giáo viên đăng tài liệu assignmetns
function insertAssignmentFile(
  assignmentFileId,
  fileTitle,
  fileUrl,
  assignmentId,
  req,
  res
) {
  const query = `INSERT INTO assignmentfile (AssignmentFileId, AssignmentId, FileTitle, FileUrl)
    VALUES (?, ?, ?, ?);`;

  db.query(
    query,
    [assignmentFileId, assignmentId, fileTitle, fileUrl],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi chèn dữ liệu tài liệu vào cơ sở dữ liệu: ", err);
        res.status(500).json({
          success: false,
          message: "Lỗi",
        });
      } else {
        console.log("Dữ liệu tài liệu đã được chèn vào cơ sở dữ liệu");
        res.status(201).json({
          success: true,
          message: "fileUrl đã được tải lên!",
          data: result,
        });
      }
    }
  );
}
// Giáo viên đăng tài liệu assignmetns
router.post(
  "/chapters/uploadAssignmentFile/:assignmentId",
  upload.single("document"),
  (req, res) => {
    const { assignmentId } = req.params;
    if (req.file) {
      console.log(req.file);
      cloudinary.uploader
        .upload(req.file.path, {
          folder: "CourseAssignment/Teacher",
          resource_type: "raw",
        })
        .then((result) => {
          const assignmentFileId = result.asset_id;
          const fileTitle = result.original_filename;
          const fileUrl = result.url;

          insertAssignmentFile(
            assignmentFileId,
            fileTitle,
            fileUrl,
            assignmentId,
            req,
            res
          );
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: "Lỗi",
          });
        });
    } else {
      res.status(400).json({
        success: false,
        message: "Không có tệp được tải lên",
      });
    }
  }
);
// Sinh viên nộp bài submission

function submitAssignment(
  assignmentId,
  userId,
  chapterId,
  courseId,
  submissionFiles,
  submittedFiles,
  req,
  res
) {
  const submissionId = uuidv4();

  const combinedFiles = [
    ...submissionFiles,
    ...(submittedFiles ? JSON.parse(submittedFiles) : []),
  ];
  const submissionFilesJson = JSON.stringify(combinedFiles);

  let query;
  let queryParams;

  if (submittedFiles && JSON.parse(submittedFiles).length > 0) {
    query = `UPDATE submissions SET SubmissionFiles = ? WHERE AssignmentId = ? AND UserId = ?`;
    queryParams = [submissionFilesJson, assignmentId, userId];
  } else {
    query = `INSERT INTO submissions (SubmissionId, AssignmentId, UserId, ChapterId, CourseId, SubmissionDate, SubmissionFiles) VALUES (?, ?, ?, ?, ?, NOW(), ?);`;
    queryParams = [
      submissionId,
      assignmentId,
      userId,
      chapterId,
      courseId,
      submissionFilesJson,
    ];
  }

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error(
        "Error inserting or updating submission data into the database:",
        err
      );
      res.status(500).json({
        success: false,
        message: "An error occurred",
      });
    } else {
      console.log(
        "Submission data has been inserted or updated into the database"
      );
      res.status(201).json({
        success: true,
        message: "Submission data has been inserted or updated!",
        data: result,
      });
    }
  });
}
router.post(
  "/chapters/uploadAssignmentFile/:assignmentId/submission",
  upload.array("documentSubmit", 10),
  (req, res, next) => {
    const assignmentId = req.body.assignmentId;
    const chapterId = req.body.chapterId;
    const userId = req.body.userId;
    const courseId = req.body.courseId;
    const submittedFiles = req.body.submissionFiles;
    const submissionFiles = []; // Mảng để lưu thông tin các tệp đã tải lên
    let files = req.files;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có tệp được tải lên",
      });
    } else {
      files.map((file, index) => {
        cloudinary.uploader
          .upload(file.path, {
            folder: "CourseAssignment/Student",
            resource_type: "raw",
          })
          .then((result) => {
            const assignmentFileId = result.asset_id;
            const fileTitle = result.original_filename;
            const fileUrl = result.url;
            // Thêm thông tin vào mảng uploadedFiles
            submissionFiles.push({
              assignmentFileId,
              fileTitle,
              fileUrl,
            });

            // Kiểm tra xem đã tải lên và lưu thông tin của tất cả các tệp hay chưa
            if (submissionFiles.length === files.length) {
              submitAssignment(
                assignmentId,
                userId,
                chapterId,
                courseId,
                submissionFiles,
                submittedFiles,
                req,
                res
              );
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              success: false,
              message: "Lỗi server",
            });
          });
      });
    }
  }
);

// upload img liên qua đến bank quizz
router.post("/questions/uploadImg", upload.single("image"), (req, res) => {
  if (req.file) {
    cloudinary.uploader
      .upload(req.file.path, {
        folder: "BankQuestion",
        resource_type: "image",
      })
      .then((result) => {
        // console.log("Image uploaded successfully:", result);
        // console.log(result.secure_url);
        res.status(200).json({
          success: true,
          message: "Image uploaded successfully",
          imageUrl: result.secure_url,
        });
      })
      .catch((err) => {
        console.log("Error uploading image:", err);
        res.status(500).json({
          success: false,
          message: "Error uploading image",
          error: err,
        });
      });
  } else {
    console.log("No image file provided.");
    res.status(400).json({
      success: false,
      message: "No image file provided",
    });
  }
});
export default router;
