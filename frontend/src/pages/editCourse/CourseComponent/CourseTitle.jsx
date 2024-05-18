import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { message } from "antd";

import "../EditWrite.scss";

export default function CourseTitle({ title, subTitle }) {
  const location = useLocation();
  const [courseTitle, setCourseTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fetchCourseTitle = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8800/api/courses/title/${location.state.CourseId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      setCourseTitle(res.data.courseTitle);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseTitle();
  }, []);

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    const updatedTitle = courseTitle;
    try {
      await axios.put(`http://localhost:8800/api/courses/title/${location.state.CourseId}`, {
        title: updatedTitle,
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
        <div className="course-title-header mt-3 mb-3">
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
