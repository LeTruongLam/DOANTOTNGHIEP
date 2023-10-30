import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import courseRoutes from "./routes/courses.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

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

app.post("/api/upload", upload.single("file"), function (req, res) {
  try {
    const file = req.file;
    if (!file) {
      // Nếu không có tệp được tải lên
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    // Truy cập thuộc tính filename
    const filename = file.filename;

    res.status(200).json(filename);
  } catch (err) {
    // Xử lý lỗi và ngoại lệ
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", userRoutes);

app.listen(8800, () => {
  console.log("Connected!");
});
