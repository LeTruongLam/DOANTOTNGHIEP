import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import { message } from "antd";

import "../EditWrite.scss";

export default function ChapterDesc({ title, subTitle, chapterId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [chapterDesc, setChapterDesc] = useState("");

  const getChapterDesc = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/chapters/desc/${chapterId}`
      );
      setChapterDesc(res.data.chapterDesc);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getChapterDesc();
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
        `http://localhost:8800/api/courses/chapters/desc/${chapterId}`,
        {
          chapterDesc: chapterDesc,
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
            !chapterDesc ? (
              <div className="italic text-slate-400		">
                Không có mô tả chương học
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(chapterDesc),
                }}
              ></div>
            )
          ) : (
            <ReactQuill
              className="editor bg-main"
              theme="snow"
              value={chapterDesc}
              onChange={setChapterDesc}
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
