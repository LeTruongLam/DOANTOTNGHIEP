import React, { useState, useEffect } from "react";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import "../EditWrite.scss";

export default function AssignmentTitle({
  title,
  subTitle,
  chapterId,
  assignmentId,
  fetchAssignmentData,
}) {
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const getAssignmentTitle = async () => {
    try {
      const res = await axios.get(
        `/courses/chapters/${chapterId}/assignments/title/${assignmentId}`
      );
      setAssignmentTitle(res.data.assignmentTitle);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAssignmentTitle();
  }, [assignmentId]);
  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(
        `/courses/chapters/${chapterId}/assignments/title/${assignmentId}`,
        {
          assignmentTitle: assignmentTitle,
        }
      );
      fetchAssignmentData();
    } catch (error) {
      console.log(error);
    }
    setIsEditing(false);
  };

  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header  mt-3 mb-3">
          <p>{title}</p>
          {!isEditing ? (
            <div onClick={handleIconClick} className="course-title-action">
              <EditIcon fontSize="small" />
              <span>{subTitle}</span>
            </div>
          ) : (
            <div onClick={handleCancelClick} className="course-title-action">
              <span>Cancel</span>
            </div>
          )}
        </div>
        <div className="course-title-body">
          {!isEditing ? (
            <div>{assignmentTitle}</div>
          ) : (
            <div className="grid">
              <TextField
                value={assignmentTitle}
                className="bg-main"
                onChange={(e) => setAssignmentTitle(e.target.value)}
              />
              <Button
                sx={{ color: "white", backgroundColor: "black" }}
                style={{
                  marginTop: "12px",
                  width: "max-content",
                }}
                variant="contained"
                onClick={handleSaveClick}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
