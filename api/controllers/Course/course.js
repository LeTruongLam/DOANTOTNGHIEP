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

    let q = "";
    if (userInfo.role === "teacher") {
      q = `SELECT courses.*,teachers.TeacherName  FROM teachers 
      JOIN courses ON courses.TeacherId = teachers.TeacherId 
      WHERE teachers.UserId = ? AND teachers.TeacherId = courses.TeacherId`;
    } else if (userInfo.role === "student") {
      q = `
      SELECT courses.*,teachers.TeacherName
      FROM courses
      JOIN classes ON courses.CourseId = classes.CourseId
      JOIN teachers ON courses.TeacherId = teachers.TeacherId
      JOIN class_student ON classes.ClassId = class_student.ClassId
      JOIN students ON class_student.StudentId = students.StudentId
      WHERE students.UserId = ? 
     `;
    }

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
export const getCourseById = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;
    let q = "";
    if (userInfo.role === "teacher") {
      q = `SELECT courses.*,teachers.TeacherName  FROM teachers 
    JOIN courses ON courses.TeacherId = teachers.TeacherId 
    WHERE teachers.UserId = ? AND teachers.TeacherId = courses.TeacherId AND courses.CourseId = ?`;
    } else if (userInfo.role === "student") {
      q = `
      SELECT courses.*,teachers.TeacherName, classes.ClassCode
      FROM courses
      JOIN classes ON courses.CourseId = classes.CourseId
      JOIN teachers ON courses.TeacherId = teachers.TeacherId
      JOIN class_student ON classes.ClassId = class_student.ClassId
      JOIN students ON class_student.StudentId = students.StudentId
      WHERE students.UserId = ?  AND courses.CourseId = ?
     `;
    }
    db.query(q, [userId, req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data[0]);
    });
  });
};

export const addCourse = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not authenticated!" });

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });

    const teacherQuery = "SELECT * FROM teachers WHERE UserId = ?";
    const userId = userInfo.id;

    db.query(teacherQuery, [userId], (teacherErr, teacherData) => {
      if (teacherErr) return res.status(500).json(teacherErr);

      if (teacherData.length === 0) {
        return res.status(403).json({ message: "User does not have permission to add courses!" });
      }

      const teacherId = teacherData[0].TeacherId;

      // Kiểm tra vai trò người dùng có quyền thêm khóa học hay không
      const insertQuery = "INSERT INTO courses(`title`, `TeacherId`, `CourseCode`) VALUES (?)";
      const insertValues = [req.body.courseTitle, teacherId, req.body.courseCode];

      db.query(insertQuery, [insertValues], (insertErr, insertData) => {
        if (insertErr) return res.status(500).json(insertErr);

        const courseId = insertData.insertId; // Lấy courseId sau khi tạo thành công
        return res
          .status(201)
          .json({ message: "Course has been created.", courseId: courseId });
      });
    });
  });
};

export const deleteCourse = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const courseId = req.params.id;
    console.log(courseId)
    const q = "DELETE FROM courses WHERE `CourseId` = ? ";

    // Kiểm tra vai trò người dùng và quyền xóa khóa học
 

    db.query(q, [courseId], (err, data) => {
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
      "UPDATE courses SET `title`=?, `desc`=?, `img`=?, `cat`=? , `StartDate`=?, `EndDate`=? WHERE `courseId` = ? ";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.StartDate,
      req.body.EndDate,
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
// export const getCourseTitle = (req, res) => {
//   const token = req.cookies.access_token;
//   if (!token) return res.status(401).json("Not authenticated!");

//   jwt.verify(token, "jwtkey", (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");
//     const chapterId = req.params.chapterId; // Sử dụng req.params.chapterId thay vì req.param.chapterId
//     const lessonId = req.params.lessonId;
//     const q = `
//       SELECT course.*
//       FROM course
//       JOIN chapters ON lessons.ChapterId = chapters.ChapterId
//       WHERE lessons.ChapterId = ? AND lessons.LessonId = ?`;

//     db.query(q, [chapterId, lessonId], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json(data);
//     });
//   });
// };

export const getCourseTitle = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const courseId = req.params.id;
    const q = "SELECT title FROM courses WHERE CourseId = ? ";
    db.query(q, [courseId], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0) {
        return res.status(404).json({ message: "Course title not found" });
      }

      const course = result[0];
      return res.status(200).json({ courseTitle: course.title });
    });
  });
};
export const updateCourseTitle = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const courseId = req.params.id;

    const q = "UPDATE courses SET `title`=? WHERE `courseId` = ? ";
    const values = [req.body.title, courseId];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json({ message: "Course title has been updated." });
    });
  });
};
export const getCourseCode = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const courseId = req.params.id;
    const q = "SELECT CourseCode FROM courses WHERE CourseId = ? ";
    db.query(q, [courseId], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0) {
        return res.status(404).json({ message: "Course code not found" });
      }

      const course = result[0];
      return res.status(200).json({ courseCode: course.CourseCode });
    });
  });
};
export const updateCourseCode = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const courseId = req.params.id;

    const q = "UPDATE courses SET `CourseCode`=? WHERE `courseId` = ? ";
    const values = [req.body.courseCode, courseId];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Course code has been updated.");
    });
  });
};

export const updateCourseDesc = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const courseId = req.params.id;

    const q = "UPDATE courses SET `desc`=? WHERE `courseId` = ? ";
    const values = [req.body.desc, courseId];

    // Check user role and course update permission
    if (userInfo.role !== "admin") {
      return res.status(403).json("Unauthorized!");
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Course title has been updated.");
    });
  });
};

export const updateCourseDate = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const courseId = req.params.id;

    const q =
      "UPDATE courses SET `StartDate`=? ,`EndDate` = ?  WHERE `courseId` = ? ";
    const values = [req.body.StartDate, req.body.EndDate, courseId];

    // Check user role and course update permission
    if (userInfo.role !== "admin") {
      return res.status(403).json("Unauthorized!");
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Course date has been updated.");
    });
  });
};
