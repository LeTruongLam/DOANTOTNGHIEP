import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import { message } from "antd";


export default function CourseTitle({ title, subTitle }) {
  const location = useLocation();
  const [courseTitle, setCourseTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fetchCourseTitle = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8800/api/courses/title/${location.state.CourseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
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
      await axios.put(
        `http://localhost:8800/api/courses/title/${location.state.CourseId}`,
        {
          title: updatedTitle,
        }
      );
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
              <span>Hủy</span>
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
              <button
                className="text-white border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
                onClick={handleSaveClick}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
