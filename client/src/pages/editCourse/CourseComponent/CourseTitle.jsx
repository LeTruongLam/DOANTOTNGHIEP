import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import "../EditWrite.scss";

export default function CourseTitle({ title, subTitle }) {
  const location = useLocation();
  const [courseTitle, setCourseTitle] = useState(
    localStorage.getItem("courseTitle") || location.state?.title || ""
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedCourseTitle = localStorage.getItem("courseTitle");
    if (storedCourseTitle) {
      setCourseTitle(storedCourseTitle);
    } else {
      setCourseTitle(location.state?.title || "");
    }
  }, [location.state?.title]);

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setCourseTitle(localStorage.getItem("courseTitle") || "");
  };

  const handleSaveClick = async () => {
    const updatedTitle = courseTitle;
    try {
      await axios.put(`/courses/title/${location.state.CourseId}`, {
        title: updatedTitle,
      });
      localStorage.setItem("courseTitle", updatedTitle);
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
            <div>{courseTitle}</div>
          ) : (
            <div className="grid">
              <TextField
                value={courseTitle}
                className="bg-main"
                onChange={(e) => setCourseTitle(e.target.value)}
              />
              <Button
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
