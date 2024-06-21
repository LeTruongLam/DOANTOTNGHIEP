import { db } from "../../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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

export const getAllStudent = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const courseId = req.params.courseId;
    const q = `
      SELECT *
      FROM students
    `;

    db.query(q, [courseId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// Hàm để thêm mới người dùng và sinh viên
export const addUserAndStudent = async (req, res) => {
  try {
    // Lấy thông tin từ request body (mảng các đối tượng)
    const usersAndStudents = req.body;
    // Kiểm tra xem có dữ liệu gửi lên không
    if (!Array.isArray(usersAndStudents) || usersAndStudents.length === 0) {
      return res.status(400).json({ error: "No data provided!" });
    }

    // Mảng để lưu các lỗi trong quá trình thêm dữ liệu
    const errors = [];

    // Hàm băm mật khẩu sử dụng bcrypt
    const hashPassword = (password) =>
      new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            reject(err);
          } else {
            resolve(hashedPassword);
          }
        });
      });

    // Hàm thêm người dùng vào cơ sở dữ liệu
    const addUser = async (user) => {
      const { UserName, Email, Password } = user;

      try {
        const hashedPassword = await hashPassword(Password);

        const insertUserQuery = `
          INSERT INTO Users (UserName, Email, Password)
          VALUES (?, ?, ?)
        `;

        const userResult = await queryAsync(insertUserQuery, [
          UserName,
          Email,
          hashedPassword,
        ]);
        console.log("User: " ,userResult )
        return userResult.insertId;
      } catch (error) {
        throw { error: "User creation error", details: error };
      }
    };

    // Hàm thêm sinh viên vào cơ sở dữ liệu
    const addStudent = async (userId, student) => {
      const { StudentName, Class, Faculty, StudentCode } = student;

      try {
        const insertStudentQuery = `
          INSERT INTO Students (UserId, StudentName, Class, Faculty, StudentCode)
          VALUES (?, ?, ?, ?, ?)
        `;

        await queryAsync(insertStudentQuery, [
          userId,
          StudentName,
          Class,
          Faculty,
          StudentCode,
        ]);
      } catch (error) {
        // Nếu có lỗi, throw để báo lỗi lên cấp cao hơn
        throw { error: "Student creation error", details: error };
      }
    };

    // Duyệt qua từng đối tượng trong mảng và thêm vào cơ sở dữ liệu
    for (const userAndStudent of usersAndStudents) {
      try {
        const userId = await addUser(userAndStudent);
        await addStudent(userId, userAndStudent);
      } catch (error) {
        // Nếu có lỗi, thêm lỗi vào mảng errors để báo lỗi cho client
        errors.push(error);
      }
    }

    // Kiểm tra nếu có lỗi, trả về lỗi
    if (errors.length > 0) {
      return res.status(500).json({ errors });
    }

    // Nếu không có lỗi, trả về thành công
    return res
      .status(201)
      .json({ message: "All users and students added successfully" });
  } catch (error) {
    // Bắt lỗi ở mọi cấp và trả về lỗi cho client
    return res
      .status(500)
      .json({ error: "Internal server error", details: error });
  }
};

// Hàm thực hiện truy vấn với async/await
const queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};
