import { db } from "../../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export const getTeacherPersonalInformation = (req, res) => {
  const userInfo = req.userInfo;
  const q = `
        SELECT *
        FROM teachers T
        JOIN Users U ON U.UserId = T.UserId
        WHERE T.UserId = ?
      `;

  db.query(q, [userInfo.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addUserAndTeacher = async (req, res) => {
  try {
    const usersAndTeachers = req.body;
    if (!Array.isArray(usersAndTeachers) || usersAndTeachers.length === 0) {
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
      const { UserName, Email, Password, Role } = user;

      // Check for unique fields
      if (await checkUniqueFields(UserName, Email)) {
        throw {
          error: "User creation error",
          details: "UserName or Email already exists",
        };
      }

      try {
        // Hash the password
        const hashedPassword = await hashPassword(Password);

        // Insert the user into the database
        const insertUserQuery = `
          INSERT INTO Users (UserName, Email, Password, Role)
          VALUES (?, ?, ?, ?)
        `;
        const userResult = await queryAsync(insertUserQuery, [
          UserName,
          Email,
          hashedPassword,
          Role,
        ]);

        return userResult.insertId;
      } catch (error) {
        // Log the error details for debugging
        console.error("Error in addUser function:", error);

        // Throw a specific error object
        throw { error: "User creation error", details: error };
      }
    };

    const addTeacher = async (userId, teacher) => {
      const { TeacherName, Faculty } = teacher;
      try {
        const insertStudentQuery = `
            INSERT INTO Teachers (UserId, TeacherName, Faculty)
            VALUES (?, ?, ?)
          `;

        await queryAsync(insertStudentQuery, [userId, TeacherName, Faculty]);
      } catch (error) {
        throw { error: "Teacher creation error", details: error };
      }
    };

    for (const usersAndTeacher of usersAndTeachers) {
      try {
        const userId = await addUser(usersAndTeacher);
        await addTeacher(userId, usersAndTeacher);
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return res.status(500).json({ errors });
    }

    return res
      .status(201)
      .json({ message: "All users and teachers added successfully" });
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

export const deleteAccountTeacher = async (req, res) => {
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
