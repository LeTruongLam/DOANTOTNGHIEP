import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";
import { Container, Draggable } from "react-smooth-dnd";
import { arrayMoveImmutable as arrayMove } from "array-move";
import "../EditWrite.scss";

import { message } from "antd";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";

export default function TheLesson({
  title,
  subTitle,
  chapterId,
  setSelectedLessonId,
  handleNext,
}) {
  const { fetchLesson } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState("");

  const onDrop = ({ removedIndex, addedIndex }) => {
    setLessons((items) => arrayMove(items, removedIndex, addedIndex));
  };

  const fetchLessonData = async () => {
    try {
      if (chapterId) {
        const data = await fetchLesson(chapterId);
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
  }, [chapterId]);

  const lessonItems = lessons.map((lesson) => (
    <Draggable
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
      className="bg-white rounded-lg mr-2  lesson-content"
      key={lesson.LessonId}
    >
      <div className="lesson-content-left">
        <DragIndicatorOutlinedIcon className="drag-handle" />
        {lesson.LessonTitle}
      </div>
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Stack direction="row" spacing={1}>
          <button
            onClick={() => {
              handleDeleteClick(lesson.LessonId);
            }}
            className="mr-2 text-xs	 rounded-2xl	 	 text-black px-2.5 py-1  text-sm font-semibold text-gray-900   ring-gray-300 hover:bg-blue-100 bg-blue-50	"
          >
            Delete
          </button>
          <button
            onClick={() => {
              setSelectedLessonId(lesson.LessonId);
              handleNext();
            }}
            className="mr-2 text-xs	 rounded-2xl	 bg-black	 text-white px-2.5 py-1 text-sm font-semibold text-gray-900   ring-gray-300 hover:bg-blue-500	"
          >
            Edit
          </button>
        </Stack>
      </span>
    </Draggable>
  ));

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.post(`http://localhost:8800/api/courses/chapters/lessons`, {
        lessonTitle: lessonTitle,
        chapterId: chapterId,
      });
      message.success("Thêm thành công!");

      fetchLessonData();
    } catch (error) {
      message.error(error.message);
    }

    setIsEditing(false);
  };
  const handleDeleteClick = async (lessonId) => {
    try {
      await axios.delete(`http://localhost:8800/api/courses/chapters/${chapterId}/lessons/${lessonId}`);
      fetchLessonData();
      message.success("Xóa thành công!");
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header mt-3 mb-3">
          <p>{title}</p>
          {chapterId &&
            (!isEditing ? (
              <div onClick={handleIconClick} className="course-title-action">
                <AddCircleOutlineOutlinedIcon fontSize="small" />
                <span>{subTitle}</span>
              </div>
            ) : (
              <div onClick={handleCancelClick} className="course-title-action">
                <span>Cancel</span>
              </div>
            ))}
        </div>
        <div className="course-title-body">
          {!isEditing ? (
            !lessons[0] ? (
              <div className="italic text-slate-400		">No lessons</div>
            ) : (
              <Container
                dragHandleSelector=".drag-handle"
                lockAxis="y"
                onDrop={onDrop}
              >
                {lessonItems}
              </Container>
            )
          ) : (
            <div className="grid">
              <TextField
                className="bg-main"
                onChange={(e) => setLessonTitle(e.target.value)}
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
