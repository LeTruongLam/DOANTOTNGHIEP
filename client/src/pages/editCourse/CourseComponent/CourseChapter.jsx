import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { message } from "antd";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import "../EditWrite.scss";
import { Container, Draggable } from "react-smooth-dnd";
import { arrayMoveImmutable as arrayMove } from "array-move";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";

export default function CourseChapter({ title, subTitle, handleEdit }) {
  const location = useLocation();
  const { fetchChapter } = useContext(AuthContext);
  const [chapterData, setChapterData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");

  const onDrop = ({ removedIndex, addedIndex }) => {
    setChapterData((items) => arrayMove(items, removedIndex, addedIndex));
  };

  const fetchData = async () => {
    try {
      const data = await fetchChapter(location.state?.CourseId);
      setChapterData(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const chapterItems = chapterData.map((chapter) => (
    <Draggable
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
      className="bg-sub lesson-content"
      key={chapter.ChapterId}
    >
      <div className="lesson-content-left">
        <DragIndicatorOutlinedIcon className="drag-handle" />
        {chapter.ChapterTitle}
      </div>
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Stack direction="row" spacing={1}>
          <Chip
            onClick={() => {
              handleEdit(chapter.ChapterId);
            }}
            label="Edit"
            sx={{ color: "white", backgroundColor: "black", fontWeight: "600" }}
            size="small"
          />
          <Chip label="Delete" size="small" sx={{ fontWeight: "600" }} />
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
      await axios.post(`/courses/chapters/title`, {
        chapterTitle: chapterTitle,
        courseId: location.state?.CourseId,
      });
      message.success("Thêm thành công!");
    } catch (error) {
      message.error(error);
    }
    setIsEditing(false);
    fetchData();
    setChapterTitle(""); // Trả lại input trống
  };
  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header  mt-3 mb-3">
          <p>{title}</p>
          {!isEditing ? (
            <div
              onClick={handleIconClick}
              className="course-title-action items-center"
            >
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
            <Container
              dragHandleSelector=".drag-handle"
              lockAxis="y"
              onDrop={onDrop}
            >
              {chapterItems}
            </Container>
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
