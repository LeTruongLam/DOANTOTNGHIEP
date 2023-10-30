import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "./EditWrite.scss";
import Dialog from "../../components/Dialog";
import AddIcon from "@mui/icons-material/Add";

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
import Button from "@mui/material/Button";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SaveIcon from "@mui/icons-material/Save";

import dayjs from "dayjs";

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

  const [startDate, setStartDate] = useState(location.state?.StartDate || "");
  const [endDate, setEndDate] = useState(location.state?.EndDate || "");

  const [chapterData, setChapterData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

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
      setFile(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (location.state) {
        try {
          const reschapter = await axios.get(
            `/courses/${location.state.CourseId}/chapters`
          );
          setChapterData(reschapter.data);
        } catch (err) {
          console.log(err);
        }
      } else return;
    };
    fetchData();
  }, []);

  const addChapter = async () => {
    if (location.state) {
      const courseId = location.state.CourseId;
      try {
        await axios.post(`/courses/${location.state?.CourseId}/chapters`, {
          chapterTitle,
          chapterDesc,
          chapterVideo,
          chapterPosition,
          courseId,
        });
        setChapterTitle("");
        setChapterDesc("");
        setChapterVideo("");
        setChapterPosition("");
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();
    try {
      const updatedTitle = title || (location.state && location.state.title);
      const updatedDesc = value || (location.state && location.state.desc);
      const updatedCat = cat || (location.state && location.state.cat);
      const updatedStartDate = startDate
        ? moment(startDate).format("YYYY-MM-DD HH:mm:ss")
        : (location.state && location.state.startDate) || "";
      const updatedEndDate = endDate
        ? moment(endDate).format("YYYY-MM-DD HH:mm:ss")
        : (location.state && location.state.endDate) || "";
      const updatedImg = file
        ? imgUrl
        : (location.state && location.state.img) || "";

      console.log(updatedTitle);
      const updatedDate = moment().format("YYYY-MM-DD HH:mm:ss");
      if (location.state) {
        await axios.put(`/courses/${location.state.CourseId}`, {
          title: updatedTitle,
          desc: updatedDesc,
          cat: updatedCat,
          img: updatedImg,
          date: updatedDate,
          StartDate: updatedStartDate,
          EndDate: updatedEndDate,
        });
      } else {
        await axios.post(`/courses/`, {
          title: updatedTitle,
          desc: updatedDesc,
          cat: updatedCat,
          img: updatedImg,
          date: updatedDate,
          StartDate: updatedStartDate,
          EndDate: updatedEndDate,
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
      const courseId = location.state.CourseId;

      await axios.post(`/courses/${location.state?.CourseId}/chapters`, {
        chapterTitle,
        chapterDesc,
        chapterVideo,
        chapterPosition,
        courseId,
      });
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
          <ListItemButton sx={{ display: "flex", justifyContent: "center" }}>
            <AddIcon sx={{ fontSize: 24 }} />
            <Dialog addEvent={handleAddChapter}></Dialog>
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
              style={{ minWidth: "50%" }} // Thiết lập chiều ngang tối thiểu là 200px
            />

            <div className="course-date" style={{ width: "50%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={dayjs(startDate)}
                    onChange={(newStartDate) => setStartDate(newStartDate)}
                  />
                  <DatePicker
                    label="Ngày kết thúc"
                    value={dayjs(endDate)}
                    onChange={(newEndDate) => setEndDate(newEndDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="course-chapter">
              <Box sx={{ width: "50%" }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Tên chương học
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Tên chương học"
                    onChange={handleChange}
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
            </div>
            <div className="course-lesson">
              <TextField
                id="outlined-basic"
                label="Nhập tên bài học"
                variant="outlined"
                style={{ minWidth: "50%" }}
              />
            </div>
            <div className="course-img">
              <div className="item">
                <span>
                  <b>Chọn hình ảnh: </b>
                </span>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  name=""
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label className="file" htmlFor="file">
                  {file ? file.name : location.state?.img || "Chọn ảnh"}
                </label>
              </div>
              {/* <img src={`../upload/${location.state.img}`} alt="" /> */}
            </div>
            <div className="editorContainer">
              <span>
                <b>Mô tả môn học </b>
              </span>
              <ReactQuill
                className="editor"
                theme="snow"
                value={value}
                onChange={setValue}
              />
            </div>
          </div>
          <SpeedDial
            ariaLabel="SpeedDial openIcon example"
            icon={<SaveIcon />}
            onClick={handleClick}
            sx={{ position: "fixed", bottom: 16, right: 16 }}
          ></SpeedDial>
        </div>
      </div>
    </div>
  );
};

export default Write;
