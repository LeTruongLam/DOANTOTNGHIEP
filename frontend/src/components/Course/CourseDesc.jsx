import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import { message } from "antd";

import EditIcon from "@mui/icons-material/Edit";

export default function CourseDesc({ title, subTitle }) {
  const location = useLocation();
  const [courseDesc, setCourseDesc] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fetchCourseDesc = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/desc/${location.state.CourseId}`
      );
      setCourseDesc(res.data.courseDesc);
    } catch (error) {
      message.error(error.message);
    }
  };
  useEffect(() => {
    fetchCourseDesc();
  }, []);

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(
        `http://localhost:8800/api/courses/desc/${location.state.CourseId}`,
        {
          desc: courseDesc,
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
          <div
            onClick={isEditing ? handleCancelClick : handleIconClick}
            className="course-title-action"
          >
            {isEditing ? (
              <span>Hủy</span>
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
            !courseDesc ? (
              <div className="italic text-slate-400		">No course description</div>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(courseDesc),
                }}
              ></div>
            )
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
          <button
            className="text-white border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
            onClick={handleSaveClick}
          >
            Lưu
          </button>
        )}
      </div>
    </div>
  );
}
