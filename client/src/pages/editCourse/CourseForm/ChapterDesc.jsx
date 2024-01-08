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
      const res = await axios.get(`/courses/chapters/desc/${chapterId}`);
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
      await axios.put(`/courses/chapters/desc/${chapterId}`, {
        chapterDesc: chapterDesc,
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
                __html: DOMPurify.sanitize(chapterDesc),
              }}
            ></div>
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