import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { message } from "antd";

import "../EditWrite.scss";

export default function CourseCode({ title, subTitle }) {
  const location = useLocation();
  const [courseCode, setCourseCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fetchCourseCode = async () => {
    try {
      const res = await axios.get(`/courses/code/${location.state.CourseId}`);
      setCourseCode(res.data.courseCode);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseCode();
  }, []);

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
      message.success("Sửa thành công!");
    } catch (error) {
      message.error(error.message);
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
