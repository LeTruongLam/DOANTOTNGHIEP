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
export const getAssignment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const chapterId = req.params.chapterId; // Sử dụng req.params.chapterId thay vì req.param.chapterId
    const assignmentId = req.params.assignmentId;
    const q = `
      SELECT assignments.*
      FROM assignments
      JOIN chapters ON assignments.ChapterId = chapters.ChapterId
      WHERE assignments.ChapterId = ? AND assignments.AssignmentId = ?`;

    db.query(q, [chapterId, assignmentId], (err, result) => {
      if (err) return res.status(500).json(err);
      const data = result[0];

      return res.status(200).json(data);
    });
  });
};

export const getAssignments = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const chapterId = req.params.chapterId; // Sử dụng req.params.chapterId thay vì req.param.chapterId
    const q = `
      SELECT assignments.*
      FROM assignments
      JOIN chapters ON assignments.ChapterId = chapters.ChapterId
      WHERE assignments.ChapterId = ?`;

    db.query(q, [chapterId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const deleteAssignment = (req, res) => {
  const chapterId = req.params.chapterId;
  const assignmentId = req.params.assignmentId;
  const q = `
      DELETE FROM assignments
      WHERE ChapterId = ? AND AssignmentId = ?
    `;

  db.query(q, [chapterId, assignmentId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ message: "Assignment deleted successfully" });
  });
};

export const addAssignmentTitle = (req, res) => {
  const assignmentTitle = req.body.assignmentTitle;
  const chapterId = req.body.chapterId;

  const q = `
      INSERT INTO assignments (AssignmentTitle, ChapterId)
      VALUES (?, ?)
    `;

  db.query(q, [assignmentTitle, chapterId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({ message: "Assignment added successfully" });
  });
};

export const getAssignmentTitle = (req, res) => {
  const assignmentId = req.params.assignmentId;
  const chapterId = req.params.chapterId;
  const q =
    "SELECT AssignmentTitle FROM assignments WHERE AssignmentId = ? AND ChapterId = ?";
  db.query(q, [assignmentId, chapterId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const assignment = result[0];
    return res
      .status(200)
      .json({ assignmentTitle: assignment.AssignmentTitle });
  });
};

export const updateAssignmentTitle = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const chapterId = req.params.chapterId;
    const assignmentId = req.params.assignmentId;
    const assignmentTitle = req.body.assignmentTitle;
    const q =
      "UPDATE assignments SET AssignmentTitle = ? WHERE ChapterId = ? AND AssignmentId = ?";
    const values = [assignmentTitle, chapterId, assignmentId];

    // Check user role and chapter update permission

    db.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ error: "An unexpected error occurred." });

      if (data.affectedRows === 0) {
        return res.status(404).json({ error: "assignment not found." });
      }
      return res.json({ message: "assignment title has been updated." });
    });
  });
};

export const getAssignmentDesc = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const assignmentId = req.params.assignmentId;
    const chapterId = req.params.chapterId;

    const q =
      "SELECT AssignmentDesc FROM assignments WHERE  AssignmentId = ? AND ChapterId = ? ";
    const values = [assignmentId, chapterId];

    // Check user role and course access permission

    db.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ error: "An unexpected error occurred." });

      if (data.length === 0) {
        return res.status(404).json({ error: "Chapter not found." });
      }
      const assignment = data[0];
      const assignmentDesc = assignment.AssignmentDesc;

      return res.json({ assignmentDesc });
    });
  });
};
export const updateAssignmentDesc = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const assignmentId = req.params.assignmentId;
    const chapterId = req.params.chapterId;
    const assignmentDesc = req.body.assignmentDesc;

    const q =
      "UPDATE  assignments SET  AssignmentDesc = ? WHERE  AssignmentId = ? AND ChapterId = ?";
    const values = [assignmentDesc, assignmentId, chapterId];

    // Check user role and chapter update permission

    db.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ error: "An unexpected error occurred." });

      if (data.affectedRows === 0) {
        return res.status(404).json({ error: "assignments not found." });
      }

      return res.json("assignments description has been updated.");
    });
  });
};

export const getAssignmentDate = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const assignmentId = req.params.assignmentId;
    const chapterId = req.params.chapterId;

    const q =
      "SELECT StartDate, EndDate FROM assignments WHERE AssignmentId = ? AND ChapterId = ?";
    const values = [assignmentId, chapterId];

    // Check user role and course access permission

    db.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ error: "An unexpected error occurred." });

      if (data.length === 0) {
        return res.status(404).json({ error: "Chapter not found." });
      }

      const assignment = data[0];
      const startDate = assignment.StartDate;
      const endDate = assignment.EndDate;

      return res.json({ startDate, endDate });
    });
  });
};

export const updateAssignmentDate = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const assignmentId = req.params.assignmentId;
    const chapterId = req.params.chapterId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const q =
      "UPDATE  assignments SET  `StartDate`=? ,`EndDate` = ?  WHERE  AssignmentId = ? AND ChapterId = ?";
    const values = [startDate, endDate, assignmentId, chapterId];

    // Check user role and chapter update permission

    db.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ error: "An unexpected error occurred." });

      if (data.affectedRows === 0) {
        return res.status(404).json({ error: "assignments not found." });
      }
      return res.json("assignments date has been updated.");
    });
  });
};

export const getAssignmentFile = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const assignmentId = req.params.assignmentId;

    const q = "SELECT * FROM assignmentfile WHERE AssignmentId = ? ";
    const values = [assignmentId];

    db.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ error: "An unexpected error occurred." });

      if (data.length === 0) {
        return res.json({ message: "assignmentId not found." });
      }
      const chapter = data[0];
      return res.json(data);
    });
  });
};
export const updateAssignmentFile = (
  assignmentFile,
  chapterId,
  assignmentId,
  req,
  res
) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE assignments SET AssignmentFile = ? WHERE ChapterId = ? AND AssignmentId = ?";
    const values = [assignmentFile, chapterId, assignmentId];

    // Check user role and chapter update permission

    db.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ error: "An unexpected error occurred." });

      if (data.affectedRows === 0) {
        return res.status(404).json({ error: "assignmentFile not found." });
      }
      return res.json({ message: "assignmentFile has been updated." });
    });
  });
};
export const AssignmentSubmission = (req, res) => {
  const assignmentId = req.body.assignmentId;
  const chapterId = req.body.chapterId;
  const studentId = req.body.studentId;
  const courseId = req.body.courseId;
  const submissonFile = JSON.stringify(req.body.submissonFile);
  const submissionContent = req.body.submissionContent;
  const submissionDate = new Date().toISOString();
  const status = 1;
  const data = [
    assignmentId,
    chapterId,
    studentId,
    courseId,
    submissionDate,
    submissionContent,
    status,
    submissonFile,
  ];
  console.log(data);
  const q = `
    INSERT INTO submissions (AssignmentId, ChapterId, StudentId, CourseId, SubmissionDate, SubmissionContent, Status, SubmissonFile)
    VALUES (?, ?, ?, ?,NOW(), ?, ?, ?)
  `;

  db.query(
    q,
    [
      assignmentId,
      chapterId,
      studentId,
      courseId,
      submissionContent,
      status,
      submissonFile,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res
        .status(201)
        .json({ message: "Assignment submission successful" });
    }
  );
};
