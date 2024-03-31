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

export const addListQuestion = (req, res, next) => {
  const questionId = uuidv4();
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const courseId = req.body.courseId;
    console.log(courseId);
    console.log(req.body.questions);
    console.log(req.body.questionImg);
    console.log(req.body.optionsAnswer);

    const q = `
    
    `;

    db.query(q, [], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
