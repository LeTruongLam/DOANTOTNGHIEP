import { db } from "../../db.js";
import jwt from "jsonwebtoken";

export const getAllCourses = (req, res) => {
  const q = "SELECT * FROM courses";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const getCourses = (req, res) => {
  const userInfo = req.userInfo;
  const userRole = userInfo.role;

  let q = "";
  if (userRole === "teacher") {
    // Query for teacher role
    q = `SELECT courses.*, teachers.TeacherName FROM teachers 
      JOIN courses ON courses.TeacherId = teachers.TeacherId 
      WHERE teachers.UserId = ? AND teachers.TeacherId = courses.TeacherId`;
  } else if (userRole === "student") {
    // Query for student role
    q = `
      SELECT courses.*, teachers.TeacherName
      FROM courses
      JOIN classes ON courses.CourseId = classes.CourseId
      JOIN teachers ON courses.TeacherId = teachers.TeacherId
      JOIN class_student ON classes.ClassId = class_student.ClassId
      JOIN students ON class_student.UserId = students.UserId
      WHERE students.UserId = ? 
     `;
  }

  db.query(q, [userInfo.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
export const getCourseById = (req, res) => {
  const userInfo = req.userInfo;
  const userId = userInfo.id;
  const userRole = userInfo.role;
  let q = "";
  if (userRole === "teacher") {
    q = `SELECT courses.*,teachers.TeacherName  FROM teachers 
    JOIN courses ON courses.TeacherId = teachers.TeacherId 
    WHERE teachers.UserId = ? AND teachers.TeacherId = courses.TeacherId AND courses.CourseId = ?`;
  } else if (userRole === "student") {
    q = `
      SELECT courses.*,teachers.TeacherName, classes.ClassCode
      FROM courses
      JOIN classes ON courses.CourseId = classes.CourseId
      JOIN teachers ON courses.TeacherId = teachers.TeacherId
      JOIN class_student ON classes.ClassId = class_student.ClassId
      JOIN students ON class_student.UserId = students.UserId
      WHERE students.UserId = ?  AND courses.CourseId = ?
     `;
  }
  db.query(q, [userId, req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json(data[0]);
  });
};

export const addCourse = (req, res) => {
  const teacherQuery = "SELECT * FROM teachers WHERE UserId = ?";
  const userId = req.userInfo.id;

  db.query(teacherQuery, [userId], (teacherErr, teacherData) => {
    if (teacherErr) return res.status(500).json(teacherErr);

    if (teacherData.length === 0) {
      return res
        .status(403)
        .json({ message: "User does not have permission to add courses!" });
    }

    const teacherId = teacherData[0].TeacherId;

    // Kiểm tra vai trò người dùng có quyền thêm khóa học hay không
    const insertQuery =
      "INSERT INTO courses(`title`, `TeacherId`, `CourseCode`) VALUES (?, ?, ?)";
    const insertValues = [req.body.courseTitle, teacherId, req.body.courseCode];

    db.query(insertQuery, insertValues, (insertErr, insertData) => {
      if (insertErr) return res.status(500).json(insertErr);

      const courseId = insertData.insertId; // Lấy courseId sau khi tạo thành công
      return res
        .status(201)
        .json({ message: "Course has been created.", courseId: courseId });
    });
  });
};

export const deleteCourse = (req, res) => {
  const courseId = req.params.id;

  if (req.userInfo.role === "student") {
    return res.status(403).json({ error: "Unauthorized!" });
  }

  const deleteQuery = "DELETE FROM courses WHERE CourseId = ?";
  db.query(deleteQuery, [courseId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete course!" });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found!" });
    }

    return res.json({ message: "Course has been deleted!" });
  });
};
export const updateCourse = (req, res) => {
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
  if (req.userInfo.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized!" });
  }

  const updateQuery = "SELECT * FROM courses WHERE CourseId = ?";
  db.query(updateQuery, [courseId], (err, courseData) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update course!" });
    }

    if (courseData.length === 0) {
      return res.status(404).json({ error: "Course not found!" });
    }

    db.query(q, values, (updateErr, updateData) => {
      if (updateErr) {
        return res.status(500).json({ error: "Failed to update course!" });
      }

      return res.json({ message: "Course has been updated." });
    });
  });
};

export const getCourseTitle = (req, res) => {
  const courseId = req.params.id;
  const query = "SELECT title FROM courses WHERE CourseId = ?";

  db.query(query, [courseId], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Failed to fetch course title!" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Course title not found!" });
    }

    const course = result[0];
    return res.status(200).json({ courseTitle: course.title });
  });
};
export const updateCourseTitle = (req, res) => {
  const courseId = req.params.id;

  const q = "UPDATE courses SET `title`=? WHERE `courseId` = ? ";
  const values = [req.body.title, courseId];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Course title has been updated." });
  });
};
export const getCourseCode = (req, res) => {
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
};
export const getCourseDesc = (req, res) => {
  const courseId = req.params.id;
  const q = "SELECT `desc` FROM courses WHERE CourseId = ? ";
  db.query(q, [courseId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) {
      return res.status(404).json({ message: "Course desc not found" });
    }

    const course = result[0];
    return res.status(200).json({ courseDesc: course.desc });
  });
};
export const updateCourseCode = (req, res) => {
  const courseId = req.params.id;

  const q = "UPDATE courses SET `CourseCode`=? WHERE `courseId` = ? ";
  const values = [req.body.courseCode, courseId];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Course code has been updated.");
  });
};

export const updateCourseDesc = (req, res) => {
  const courseId = req.params.id;

  const q = "UPDATE courses SET `desc`=? WHERE `courseId` = ? ";
  const values = [req.body.desc, courseId];

  // Check user role and course update permission

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Course title has been updated.");
  });
};

export const updateCourseDate = (req, res) => {
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
};
