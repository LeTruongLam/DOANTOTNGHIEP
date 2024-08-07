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
  const { classCode } = req.body;  // Getting userId from request body
  const { courseId } = req.params;
  const classId = uuidv4();
  const userInfo = req.userInfo;
  // Query to insert new class
  const insertClassQuery = `
    INSERT INTO classes (ClassId, ClassCode, CourseId, TeacherId)
    VALUES (?, ?, ?, ?)
  `;

  // Query to get TeacherId from userId
  const getTeacherIdQuery = `
    SELECT TeacherId
    FROM teachers
    WHERE UserId = ?
  `;

  // First, get the TeacherId from the teachers table using userId
  db.query(getTeacherIdQuery, [userInfo.id], (err, result) => {
    if (err) {
      console.error("Error retrieving teacher ID:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacherId = result[0].TeacherId;

    // Insert new class
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


export const addClassStudent = (req, res) => {
  const { studentDatas } = req.body;
  const studentCodes = studentDatas.map((student) => student.StudentCode);

  // Lấy ClassId từ request
  const classId = req.params.classId;

  // Truy vấn SQL để lấy UserId từ bảng students dựa trên StudentCode
  const getUserIdsQuery = `
    SELECT UserId, StudentCode
    FROM students
    WHERE StudentCode IN (?)
  `;

  // Thực hiện truy vấn để lấy UserId từ StudentCode
  db.query(getUserIdsQuery, [studentCodes], (queryErr, queryResult) => {
    if (queryErr) {
      console.error("Error querying database:", queryErr);
      return res.status(500).json({ error: "Database query error" });
    }

    // Mảng mới gồm các đối tượng UserId và StudentCode
    const userIdsWithCodes = queryResult.map((row) => ({
      UserId: row.UserId,
      StudentCode: row.StudentCode,
    }));

    // Lấy danh sách UserId hiện có trong lớp học
    const checkExistingStudentsQuery = `
      SELECT UserId
      FROM class_student
      WHERE ClassId = ?
    `;

    // Thực hiện truy vấn để lấy danh sách UserId đã có trong lớp học
    db.query(checkExistingStudentsQuery, [classId], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error querying database:", checkErr);
        return res.status(500).json({ error: "Database query error" });
      }

      const existingUserIds = checkResult.map((row) => row.UserId);

      // Lọc ra các UserId chưa có trong lớp học
      const newUserIds = userIdsWithCodes.filter(
        (student) => !existingUserIds.includes(student.UserId)
      );

      // Nếu không có sinh viên mới để thêm vào lớp học
      if (newUserIds.length === 0) {
        return res
          .status(200)
          .json({ message: "Không có sinh viên mới để thêm vào lớp học" });
      }

      // Thực hiện thêm sinh viên vào lớp học
      const insertPromises = newUserIds.map(({ UserId }) => {
        return new Promise((resolve, reject) => {
          const insertClassStudentQuery = `
            INSERT INTO class_student (ClassId, UserId)
            VALUES (?, ?)
          `;
          db.query(
            insertClassStudentQuery,
            [classId, UserId],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error("Error inserting into class_student:", insertErr);
                reject(insertErr);
              } else {
                resolve(insertResult);
              }
            }
          );
        });
      });

      // Chờ tất cả các Promise thực hiện xong
      Promise.all(insertPromises)
        .then(() => {
          res
            .status(201)
            .json({ message: "Thêm sinh viên vào lớp học thành công" });
        })
        .catch((error) => {
          console.error("Error adding class student:", error);
          res.status(500).json({ error: "Error adding class student" });
        });
    });
  });
};

export const getClassStudent = (req, res) => {
  const courseId = req.params.courseId;
  const classId = req.params.classId;
  const q = `
      SELECT students.StudentName, students.StudentCode,students.UserId, classes.*
      FROM class_student
      JOIN students ON class_student.UserId =  students.UserId
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
      JOIN students ON class_student.UserId =  students.UserId
      JOIN classes ON class_student.ClassId = classes.ClassId
      WHERE classes.CourseId = ? AND classes.ClassCode = ?
    `;
  db.query(q, [courseId, classCode], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
export const getClassById = (req, res) => {
  const classId = req.params.classId;
  const courseId = req.params.courseId;

  const q = `
    SELECT *
    FROM classes
    WHERE ClassId = ? AND CourseId = ?
  `;

  db.query(q, [classId, courseId], (err, data) => {
    if (err) {
      console.error("Database error:", err); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "Class not found" });
    }
    console.log("Query successful, returning data:", data[0]); // Log the data being returned
    return res.status(200).json(data[0]); // Assuming you want to return a single object, not an array
  });
};
