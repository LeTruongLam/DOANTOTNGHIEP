import React, { useState, useEffect } from "react";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import "../EditWrite.scss";

export default function LessonTitle({ title, subTitle, chapterId, lessonId, fetchLessonData }) {
  const [chapterTitle, setChapterTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const getChapterTitle = async () => {
    try {
      const res = await axios.get(
        `/courses/chapters/${chapterId}/lessons/title/${lessonId}`
      );
      setChapterTitle(res.data.lessonTitle);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChapterTitle();
  }, [lessonId]);
  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put( `/courses/chapters/${chapterId}/lessons/title/${lessonId}`, {
        lessonTitle: chapterTitle,
      });
      fetchLessonData()
    } catch (error) {
      console.log(error);
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
            <div>{chapterTitle}</div>
          ) : (
            <div className="grid">
              <TextField
                value={chapterTitle}
                className="bg-main"
                onChange={(e) => setChapterTitle(e.target.value)}
              />
              <Button
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
