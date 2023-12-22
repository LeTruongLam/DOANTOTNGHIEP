import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import "../EditWrite.scss";

export default function CourseCode({ title, subTitle }) {
  const location = useLocation();
  const [courseCode, setCourseCode] = useState(location.state.CourseCode);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log(location.state.CourseCode);
  }, [location.state?.CourseCode]);

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    const updatedCode = courseCode;
    try {
      await axios.put(`/courses/code/${location.state.CourseId}`, {
        courseCode: updatedCode,
      });
    } catch (error) {
      console.log(error);
    }
    setIsEditing(false);
  };

  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header">
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
            <div>{courseCode}</div>
          ) : (
            <div className="grid">
              <TextField
                value={courseCode}
                className="bg-main"
                onChange={(e) => setCourseCode(e.target.value)}
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
