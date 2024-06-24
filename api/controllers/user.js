import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getInfo = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;
    const q =
      "SELECT * FROM students INNER JOIN users ON students.UserId = users.UserId WHERE users.UserId = ?";

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });
  });
};
export const updateInfo = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;
    const { Email, PhoneNo } = req.body;

    const q = "UPDATE students SET Email = ?, PhoneNo = ? WHERE UserId = ?";
    db.query(q, [Email, PhoneNo, userId], (err, result) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("User information updated successfully!");
    });
  });
};
export const getAccountStudent = (req, res) => {
  const q = `
    SELECT *
    FROM users
    JOIN students ON students.UserId = users.UserId
    ORDER BY students.StudentCode
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
export const getAccountTeacher = (req, res) => {
  const q = `
    SELECT *
    FROM users
    JOIN teachers ON teachers.UserId = users.UserId
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
