import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import studentRoutes from "./routes/students.js";
import courseRoutes from "./routes/courses.js";
import questionRoutes from "./routes/question.js";
import classRoutes from "./routes/class.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import routeUpload from "./routes/routeUpload.js";
import { db } from "./db.js";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
    // cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload/:chapterId", upload.single("file"), function (req, res) {
  try {
    const file = req.file;
    if (!file) {
      // Nếu không có tệp được tải lên
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    // Truy cập thuộc tính filename
    const filename = file.filename;
    const chapterId = req.params.chapterId;

    // Lưu tên tệp vào cơ sở dữ liệu
    db.query(
      "UPDATE chapters SET ChapterDocument = ? WHERE ChapterId = ?",
      [filename, chapterId],
      (err, data) => {
        if (err) {
          // Xử lý lỗi truy vấn cơ sở dữ liệu
          console.error(err);
          res.status(500).json({ error: "Failed to save file to database" });
          return;
        }

        // Trả về tên tệp đã lưu thành công
        res.status(200).json({ filename });
      }
    );
  } catch (err) {
    // Xử lý lỗi và ngoại lệ
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/chapters/:chapterId/document", function (req, res) {
  const chapterId = req.params.chapterId;

  // Truy vấn cơ sở dữ liệu để lấy tên tệp ChapterDocument dựa trên chapterId
  db.query(
    "SELECT ChapterDocument FROM chapters WHERE ChapterId = ?",
    [chapterId],
    (err, results) => {
      if (err) {
        // Xử lý lỗi truy vấn cơ sở dữ liệu
        console.error(err);
        res
          .status(500)
          .json({ error: "Failed to fetch ChapterDocument from database" });
        return;
      }

      if (results.length === 0 || !results[0].ChapterDocument) {
        // Nếu không tìm thấy tên tệp ChapterDocument trong cơ sở dữ liệu
        res.status(404).json({ error: "ChapterDocument not found" });
        return;
      }

      // Trả về tên tệp ChapterDocument
      const filename = results[0].ChapterDocument;
      // console.log(filename)
      res.status(200).json({ filename });
    }
  );
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/infor", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/users", routeUpload);
app.use("/api/questions", questionRoutes);

app.listen(8800, () => {
  console.log("Connected!");
});
