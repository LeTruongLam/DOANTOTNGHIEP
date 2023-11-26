import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import "../EditWrite.scss";
import LessonForm from "../CourseForm/LessonForm";


export default function TheLesson({ title, subTitle, selectedChapterId }) {
  const { fetchLesson } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [openForm, setOpenForm] = useState(false);

  const fetchLessonData = async () => {
    try {
      if (selectedChapterId) {
        const data = await fetchLesson(selectedChapterId);
        setLessons(data); // Lưu kết quả vào state lessons
      } else {
        setLessons([]); // Đặt state lessons thành một mảng rỗng nếu selectedChapterId không có giá trị
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLessonData();

  }, [selectedChapterId]);

  const lessonItems = lessons.map((lesson) => (
    <div className="bg-sub lesson-content" key={lesson.id}>
      <div className="lesson-content-left">
        <DragIndicatorOutlinedIcon />
        {lesson.LessonTitle}
      </div>
      <EditIcon
        onClick={(e) => {
          setOpenForm(true);
        }}
        fontSize="small"
      />
    </div>
  ));

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.post(`/courses/chapters/lessons`, {
        lessonTitle: lessonTitle,
        chapterId: selectedChapterId,
      });
    } catch (error) {
      console.log(error);
    }

    setIsEditing(false);
  };
  const onCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <div className="course-title">
      {openForm &&  (
        <LessonForm
          isOpen={openForm}
          isClose={onCloseForm}
          type="add"
        ></LessonForm>
      )}

      <div className="course-title-wrapper">
        <div className="course-title-header">
          <p>{title}</p>
          {!isEditing ? (
            <div onClick={handleIconClick} className="course-title-action">
              <AddCircleOutlineOutlinedIcon fontSize="small" />
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
            <>{lessonItems}</>
          ) : (
            <div className="grid">
              <TextField
                className="bg-main"
                onChange={(e) => setLessonTitle(e.target.value)}
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
