import { db } from "../../db.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

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

export const getClassCourse = (req, res) => {
  const courseId = req.params.courseId;
  const q = `
      SELECT classes.* , courses.title
      FROM classes
      JOIN courses ON classes.CourseId = courses.CourseId
      WHERE classes.CourseId = ?
    `;

  db.query(q, [courseId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
export const deleteClass = (req, res) => {
  
  const classId = req.params.classId;
  const query = `
    DELETE FROM classes
    WHERE ClassId = ?
  `;

  db.query(query, [classId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json({ message: "Class deleted successfully" });
  });
};
export const addClassCourse = (req, res) => {
  const { classCode, teacherId } = req.body;
  const { courseId } = req.params;
  const classId = uuidv4();

  // Query to check for duplicate ClassCode
  const checkDuplicateQuery = `
    SELECT COUNT(*) AS count
    FROM classes
    WHERE ClassCode = ?
  `;

  // Query to insert new class
  const insertClassQuery = `
    INSERT INTO classes (ClassId, ClassCode, CourseId, TeacherId)
    VALUES (?, ?, ?, ?)
  `;

  // Check if ClassCode already exists
  db.query(checkDuplicateQuery, [classCode], (err, result) => {
    if (err) {
      console.error("Error checking for duplicate class code:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    const isDuplicate = result[0].count > 0;
    if (isDuplicate) {
      return res.status(400).json({ message: "Class code already exists" });
    }

    // Insert new class if no duplicate found
    db.query(
      insertClassQuery,
      [classId, classCode, courseId, teacherId],
      (err, result) => {
        if (err) {
          console.error("Error inserting new class:", err);
          return res
            .status(500)
            .json({ error: "Database error", details: err });
        }
        return res
          .status(201)
          .json({ message: "Class added successfully", classId });
      }
    );
  });
};
const checkClassStudent = (courseId, studentId) => {
  return new Promise((resolve, reject) => {
    const checkQuery = `
      SELECT * FROM class_student 
      JOIN classes ON classes.ClassId = class_student.ClassId
      JOIN students ON class_student.StudentId = students.StudentId
      WHERE classes.CourseId = ? AND class_student.StudentId = ?
    `;

    db.query(checkQuery, [courseId, studentId], (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const addClassStudent = (req, res) => {
  const { classId, studentIds, classCode, courseId } = req.body;

  // Kiểm tra classId có trùng studentIds hay không
  const checkQuery = `
      SELECT *
      FROM class_student
      WHERE ClassId = ? AND StudentId IN (?)
    `;

  db.query(checkQuery, [classId, studentIds], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ error: checkErr.message });
    }

    // Lấy danh sách sinh viên đã tồn tại trong lớp
    const existingStudentIds = checkResult.map((row) => row.StudentId);

    // Lọc ra studentIds không trùng
    const uniqueStudentIds = studentIds.filter((studentId) => {
      return !existingStudentIds.includes(studentId);
    });

    // Kiểm tra nếu không có sinh viên mới để thêm
    if (uniqueStudentIds.length === 0) {
      return res
        .status(200)
        .json({ message: "Không có sinh viên mới để thêm" });
    }

    // Kiểm tra xem sinh viên đã được thêm vào lớp trong khóa học này chưa
    const checkPromises = studentIds.map((studentId) => {
      return checkClassStudent(courseId, studentId);
    });

    Promise.all(checkPromises)
      .then((checkResults) => {
        const alreadyAddedStudents = checkResults.filter(
          (result) => result.length > 0
        );

        if (alreadyAddedStudents.length > 0) {
          return res.status(200).json({
            message: "Sinh viên đã có tên trong khóa học này",
          });
        }

        // Chèn dữ liệu vào bảng class_student
        const insertQuery = `
            INSERT INTO class_student (ClassId, StudentId)
            VALUES (?, ?)
          `;

        const insertPromises = uniqueStudentIds.map((studentId) => {
          return new Promise((resolve, reject) => {
            db.query(
              insertQuery,
              [classId, studentId],
              (insertErr, insertData) => {
                if (insertErr) reject(insertErr);
                else resolve(insertData);
              }
            );
          });
        });

        Promise.all(insertPromises)
          .then((results) => {
            return res
              .status(201)
              .json({ message: "Thêm sinh viên thành công" });
          })
          .catch((insertErr) => {
            return res.status(500).json({ error: insertErr.message });
          });
      })
      .catch((checkErr) => {
        return res.status(500).json({ error: checkErr.message });
      });
  });
};

export const getClassStudent = (req, res) => {
  const courseId = req.params.courseId;
  const classId = req.params.classId;
  const q = `
      SELECT students.StudentName, students.StudentCode,students.UserId, classes.*
      FROM class_student
      JOIN students ON class_student.StudentId =  students.StudentId
      JOIN classes ON class_student.ClassId = classes.ClassId
      WHERE classes.CourseId = ? AND classes.ClassId = ?
    `;

  db.query(q, [courseId, classId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
export const getClassStudentByClassCode = (req, res) => {
  const courseId = req.params.courseId;
  const classCode = req.params.classCode;
  const q = `
      SELECT students.StudentName, students.StudentCode,students.UserId, classes.*
      FROM class_student
      JOIN students ON class_student.StudentId =  students.StudentId
      JOIN classes ON class_student.ClassId = classes.ClassId
      WHERE classes.CourseId = ? AND classes.ClassCode = ?
    `;
  db.query(q, [courseId, classCode], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
