import React, { useState, useEffect } from "react";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { message } from "antd";

import "../EditWrite.scss";

export default function ChapterTitle({ title, subTitle, chapterId }) {
  const [chapterTitle, setChapterTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const getChapterTitle = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/api/courses/chapters/title/${chapterId}`);
      setChapterTitle(res.data.chapterTitle);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    console.log("id: " + chapterId);
    getChapterTitle();
  }, []);
  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`http://localhost:8800/api/courses/chapters/title/${chapterId}`, {
        chapterTitle: chapterTitle,
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
        <div className="course-title-header  mt-3 mb-3">
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
            !chapterTitle ? (
              <div className="italic text-slate-400		">No chapter title</div>
            ) : (
              <div>{chapterTitle}</div>
            )
          ) : (
            <div className="grid">
              <TextField
                value={chapterTitle}
                className="bg-main"
                onChange={(e) => setChapterTitle(e.target.value)}
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