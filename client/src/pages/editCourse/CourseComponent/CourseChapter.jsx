import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import Box from "@mui/material/Box";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { message } from "antd";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import "../EditWrite.scss";
export default function CourseChapter({
  title,
  subTitle,
  onShowForm,
  selectChapter,
  selectedChapterId,
}) {
  const location = useLocation();
  const { fetchChapter } = useContext(AuthContext);
  const [chapterData, setChapterData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");

  const [value, setValue] = useState("");

  const fetchData = async () => {
    try {
      const data = await fetchChapter(location.state.CourseId);
      setChapterData(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
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
        courseId: location.state.CourseId,
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
            <div className="chapter-select">
              <Box className="box-select">
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      selectChapter(e.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {chapterData.map((chapter, chapterIndex) => (
                      <MenuItem key={chapterIndex} value={chapter.ChapterId}>
                        {chapter.ChapterTitle}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {selectedChapterId && (
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="Edit"
                    sx={{ color: "white", backgroundColor: "black" }}
                    size="small"
                    onClick={() => {
                      onShowForm();
                    }}
                  />
                </Stack>
              )}
            </div>
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
