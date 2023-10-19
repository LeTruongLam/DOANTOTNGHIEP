import { db } from "../../db.js";
import jwt from "jsonwebtoken";

export const authorize = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    const decodedToken = jwt.verify(token, "jwtkey");
    req.userRole = decodedToken.role;
    next();
  } catch (err) {
    return res.status(403).json("Token is not valid!");
  }
};
export const getAllCourses = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "SELECT * FROM courses";

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });
  });
};


export const getCourses = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;
    const q = "SELECT * FROM courses WHERE UserId = ?";

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });
  });
};

export const getCourse = (req, res) => {
  const q =
    "SELECT p.CourseId, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN courses p ON u.UserId = p.UserId WHERE p.CourseId = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};

export const addCourse = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    console.log(userInfo.role);
    // Kiểm tra vai trò người dùng có quyền thêm khóa học hay không
    if (userInfo.role !== "admin") {
      return res.status(403).json("Unauthorized!");
    }

    const q =
      "INSERT INTO courses(`title`, `desc`, `img`, `cat`, `date`,`UserId`) VALUES (?)";
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
};

export const deleteCourse = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const courseId = req.params.id;
    const q = "DELETE FROM courses WHERE `CourseId` = ? AND `UserId` = ?";

    // Kiểm tra vai trò người dùng và quyền xóa khóa học
    if (userInfo.role !== "admin" && userInfo.id !== courseId) {
      return res.status(403).json("Unauthorized!");
    }

    db.query(q, [courseId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });
  });
};
export const updateCourse = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const courseId = req.params.id;
    
    const q =
      "UPDATE courses SET `title`=?, `desc`=?, `img`=?, `cat`=?, `date`=? WHERE `courseId` = ? ";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      courseId,
    ];

    // Kiểm tra vai trò người dùng và quyền cập nhật khóa học
    if (userInfo.role !== "admin") {
      return res.status(403).json("Unauthorized!");
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
};