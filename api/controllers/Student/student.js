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
    const usersAndStudents = req.body;

    if (!Array.isArray(usersAndStudents) || usersAndStudents.length === 0) {
      return res.status(400).json({ error: "No data provided!" });
    }

    const errors = [];

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

    const checkUniqueFields = async (UserName, Email) => {
      const checkQuery = `
        SELECT COUNT(*) AS count
        FROM Users
        WHERE UserName = ? OR Email = ?
      `;
      const result = await queryAsync(checkQuery, [UserName, Email]);
      return result[0].count > 0;
    };

    const addUser = async (user) => {
      const { UserName, Email, Password } = user;

      if (await checkUniqueFields(UserName, Email)) {
        throw {
          error: "User creation error",
          details: "UserName or Email already exists",
        };
      }

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
        return userResult.insertId;
      } catch (error) {
        throw { error: "User creation error", details: error };
      }
    };

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
        throw { error: "Student creation error", details: error };
      }
    };

    for (const userAndStudent of usersAndStudents) {
      try {
        const userId = await addUser(userAndStudent);
        await addStudent(userId, userAndStudent);
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return res.status(500).json({ errors });
    }

    return res
      .status(201)
      .json({ message: "All users and students added successfully" });
  } catch (error) {
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
export const deleteAccountStudent = async (req, res) => {
  const { ids } = req.body; // Expecting an array of UserId values in the request body
  // Validate the input
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No IDs provided!" });
  }

  // Create placeholders for the query
  const placeholders = ids.map(() => "?").join(", ");

  // Prepare the delete query
  const deleteUsersQuery = `DELETE FROM Users WHERE UserId IN (${placeholders})`;

  try {
    // Execute the delete query
    await queryAsync(deleteUsersQuery, ids);

    // Return success response
    return res.status(200).json({ message: "Accounts deleted successfully" });
  } catch (error) {
    // Log the error for debugging
    console.error("Error deleting accounts:", error);

    // Return error response
    return res
      .status(500)
      .json({ error: "Internal server error", details: error });
  }
};
