import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import { message } from "antd";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";

import "../EditWrite.scss";

export default function CourseDesc({ title, subTitle }) {
  const location = useLocation();
  const storedCourseDesc = localStorage.getItem("courseDesc");
  const [courseDesc, setCourseDesc] = useState(
    storedCourseDesc || location.state?.desc || ""
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedCourseDesc = localStorage.getItem("courseDesc");
    if (storedCourseDesc) {
      setCourseDesc(storedCourseDesc);
    } else {
      setCourseDesc(location.state?.desc || "");
    }
  }, [location.state?.desc]);

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`/courses/desc/${location.state.CourseId}`, {
        desc: courseDesc,
      });
      localStorage.setItem("courseDesc", courseDesc);
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
          <div
            onClick={isEditing ? handleCancelClick : handleIconClick}
            className="course-title-action"
          >
            {isEditing ? (
              <span>Cancel</span>
            ) : (
              <>
                <EditIcon fontSize="small" />
                <span>{subTitle}</span>
              </>
            )}
          </div>
        </div>
        <div className="course-title-body">
          {!isEditing ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(courseDesc),
              }}
            ></div>
          ) : (
            <ReactQuill
              className="editor bg-main"
              theme="snow"
              value={courseDesc}
              onChange={setCourseDesc}
            />
          )}
        </div>
        {isEditing && (
          <Button
            sx={{ color: "white", backgroundColor: "black" }}
            style={{ marginTop: "12px" }}
            variant="contained"
            onClick={handleSaveClick}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
