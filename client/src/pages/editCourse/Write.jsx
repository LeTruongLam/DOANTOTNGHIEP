import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "./EditWrite.scss";
import Dialog from "../../components/Dialog";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const Write = () => {
  const location = useLocation();
  const [title, setTitle] = useState(location.state?.title || "");
  const [value, setValue] = useState(location.state?.desc || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(location.state?.cat || "");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterDesc, setChapterDesc] = useState("");
  const [chapterVideo, setChapterVideo] = useState("");
  const [chapterPosition, setChapterPosition] = useState("");

  const [chapterData, setChapterData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const courseId = location.state.CourseId;
  const navigate = useNavigate();

  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
    console.log(event.target.value);
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post("/upload", formData);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reschapter = await axios.get(`/courses/${courseId}/chapters`);
        setChapterData(reschapter.data);
        console.log(reschapter.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [courseId]);

  const addChapter = async () => {
    try {
      const response = await axios.post(
        `/courses/${location.state?.CourseId}/chapters`,
        {
          chapterTitle,
          chapterDesc,
          chapterVideo,
          chapterPosition,
          courseId,
        }
      );
      setChapterTitle("");
      setChapterDesc("");
      setChapterVideo("");
      setChapterPosition("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (e) => {
    const imgUrl = await upload();

    try {
      const updatedTitle = title || location.state?.title;
      const updatedDesc = value || location.state?.desc;
      const updatedCat = cat || location.state?.cat;
      const updatedImg = file ? imgUrl : location.state?.img || "";
      const updatedDate = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

      if (location.state) {
        await axios.put(`/courses/${location.state.CourseId}`, {
          title: updatedTitle,
          desc: updatedDesc,
          cat: updatedCat,
          img: updatedImg,
        });
      } else {
        await axios.post(`/courses/`, {
          title: updatedTitle,
          desc: updatedDesc,
          cat: updatedCat,
          img: updatedImg,
          date: updatedDate,
        });
      }
      await addChapter();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (event, chapterId) => {
    // Xử lý khi nhấp vào biểu tượng sửa
    console.log("Sửa chương có ID:", chapterId);
  };
  const handleDeleteChapter = async (chapterId) => {
    // Xử lý khi nhấp vào biểu tượng xóa
    console.log("Xóa chương có ID:", chapterId);
    try {
      await axios.delete(`/courses/${chapterId}/chapters`);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddChapter = async (chapterTitle) => {
    console.log("Thêm chương");
    try {
      const response = await axios.post(
        `/courses/${location.state?.CourseId}/chapters`,
        {
          chapterTitle,
          chapterDesc,
          chapterVideo,
          chapterPosition,
          courseId,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickMenu = () => {
    setOpenIndex(!openIndex);
  };

  return (
    <div className="write-course">
      <div className="container-left">
        <List
          sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleClickMenu}>
            <ListItemText primary={"Danh sách chương"} />
            {openIndex ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openIndex} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {chapterData.map((chapter, chapterIndex) => (
                <ListItemButton key={chapterIndex} sx={{ pl: 4 }}>
                  <ListItemText
                    primary={`Chương ${chapterIndex + 1}: ${
                      chapter.ChapterTitle
                    }`}
                  />
                  <ListItemIcon>
                    <Dialog
                      onClick={(event) => handleEdit(event, chapter.ChapterId)}
                      deleteEvent={() => handleDeleteChapter(chapter.ChapterId)}
                      addEvent={handleAddChapter}
                    ></Dialog>
                  </ListItemIcon>
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </div>
      <div className="container-right">
        <div className="course-container">
          <div className="content">
            <TextField
              id="standard-basic"
              label="Tên môn học"
              variant="standard"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              style={{ minWidth: "100%" }} // Thiết lập chiều ngang tối thiểu là 200px
            />

            <div className="course-date">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker label="Ngày bắt đầu" />
                  <DatePicker label="Ngày kết thúc" />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="course-chapter">
              <Box sx={{ width: "400px" }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Tên chương học
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {chapterData.map((chapter, chapterIndex) => (
                      <MenuItem key={chapterIndex} value={chapter.ChapterTitle}>
                        {chapter.ChapterTitle}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div className="course-lesson">
              <TextField
                id="outlined-basic"
                label="Nhập tên bài học"
                variant="outlined"
              />
            </div>
            <div className="editorContainer">
              <ReactQuill
                className="editor"
                theme="snow"
                value={value}
                onChange={setValue}
              />
            </div>
          </div>
          <div className="menu">
            <div className="item">
              <h1>Publish</h1>
              <span>
                <b>Status: </b> Draft
              </span>
              <span>
                <b>Visibility: </b> Public
              </span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                name=""
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label className="file" htmlFor="file">
                Upload Image
              </label>
              <div className="buttons">
                <button>Save as a draft</button>
                <button onClick={handleClick}>Publish</button>
              </div>
            </div>
          </div>
          <div className="chapter">
            <h2>Add Chapter</h2>
            <input
              type="text"
              placeholder="Chapter Title"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
            />
            <textarea
              placeholder="Chapter Description"
              value={chapterDesc}
              onChange={(e) => setChapterDesc(e.target.value)}
            ></textarea>
            <input
              type="text"
              placeholder="Chapter Video URL"
              value={chapterVideo}
              onChange={(e) => setChapterVideo(e.target.value)}
            />
            <input
              type="text"
              placeholder="Chapter Position"
              value={chapterPosition}
              onChange={(e) => setChapterPosition(e.target.value)}
            />
            <button onClick={addChapter}>Add Chapter</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
