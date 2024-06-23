import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import { message } from "antd";

export default function CourseCode({ title, subTitle }) {
  const location = useLocation();
  const [courseCode, setCourseCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fetchCourseCode = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/code/${location.state.CourseId}`
      );
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
      await axios.put(
        `http://localhost:8800/api/courses/code/${location.state.CourseId}`,
        {
          courseCode: updatedCode,
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
        <div className="course-title-header  mt-3 mb-3">
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
            <div>{courseCode}</div>
          ) : (
            <div className="grid">
              <TextField
                value={courseCode}
                className="bg-main"
                onChange={(e) => setCourseCode(e.target.value)}
              />
              <button
                className=" text-white border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
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
