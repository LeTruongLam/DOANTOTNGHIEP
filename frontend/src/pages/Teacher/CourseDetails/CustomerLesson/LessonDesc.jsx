import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import { message } from "antd";
import EditIcon from "@mui/icons-material/Edit";
import "../EditWrite.scss";

export default function ChapterDesc({ title, subTitle, chapterId, lessonId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [lessonDesc, setLessonDesc] = useState("");

  const getLessonDesc = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/chapters/${chapterId}/lessons/desc/${lessonId}`
      );
      setLessonDesc(res.data.lessonDesc);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getLessonDesc();
  }, [lessonId]);

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(
        `http://localhost:8800/api/courses/chapters/${chapterId}/lessons/desc/${lessonId}`,
        {
          lessonDesc: lessonDesc,
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
            !lessonDesc ? (
              <div className="italic text-slate-400		">
                Không có mô tả bài học
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(lessonDesc),
                }}
              ></div>
            )
          ) : (
            <ReactQuill
              className="editor bg-main"
              theme="snow"
              value={lessonDesc}
              onChange={setLessonDesc}
            />
          )}
        </div>
        {isEditing && (
          <button
            className="text-white  border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
            onClick={handleSaveClick}
          >
            Lưu
          </button>
        )}
      </div>
    </div>
  );
}
