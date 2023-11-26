import React, { useContext, useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import "./EditWrite.scss";
import { AuthContext } from "../../context/authContext";
import DropFileInput from "../../components/drop-file-input/DropFileInput";
import CourseFile from "./CourseComponent/CourseFile";
import AlertDialog from "../../components/AlertDialog";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import ChapterForm from "./CourseForm/ChapterForm";
import CourseTitle from "./CourseComponent/CourseTitle";
import CourseDate from "./CourseComponent/CourseDate";
import CourseDesc from "./CourseComponent/CourseDesc";
import CourseChapter from "./CourseComponent/CourseChapter";
import TheLesson from "./CourseComponent/TheLesson";
const Write = () => {
  const { fetchChapter } = useContext(AuthContext);

  const location = useLocation();
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [chapterData, setChapterData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const [openForm, setOpenForm] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  const onFileChange = (files) => {
    const formData = new FormData();
    formData.append("image", files[0]);

    axios
      .post("/users/uploadImage", formData)
      .then((response) => {
        // Xử lý phản hồi từ API
        const { imageUrl } = response.data;
        setImageUrl(imageUrl);
      })
      .catch((error) => {
        // Xử lý lỗi
        console.error(error);
      });
  };

  const onShowForm = () => {
    setOpenForm(true);
  };
  const onCloseForm = () => {
    fetchData();
    setOpenForm(false);
  };
  const handleChapterClick = (chapterId) => {
    setSelectedChapterId(chapterId);
  };
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

  const handleDeleteChapter = async (chapterId) => {
    try {
      await axios.delete(`/courses/${chapterId}/chapters`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickMenu = () => {
    setOpenIndex(!openIndex);
  };

  return (
    <div className="write-course">
      {openForm && (
        <ChapterForm
          isOpen={openForm}
          isClose={onCloseForm}
          fetchChapter={fetchData}
          chapterId={selectedChapterId}
          type="add"
        ></ChapterForm>
      )}
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
                  <ListItemIcon
                    onClick={() => handleChapterClick(chapter.ChapterId)}
                  >
                    <AlertDialog
                      fetchChapter={fetchData}
                      deleteEvent={() => handleDeleteChapter(chapter.ChapterId)}
                      chapterId={selectedChapterId}
                    ></AlertDialog>
                  </ListItemIcon>
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </div>
      <div className="container-right">
        <div className="course-container">
          <div className="course-custom">
            <div className="course-custom-title">
              <div className="course-custom-icon">
                <GridViewOutlinedIcon />
              </div>
              <p>Customer your course</p>
            </div>
            <CourseTitle title="Course Title" subTitle="Edit title" />
            <CourseDate title="Course Date" subTitle="Edit date" />
            <div className="course-img">
              <DropFileInput onFileChange={onFileChange} />
            </div>
            <div className="editorContainer">
              <CourseDesc
                title="Course Desccription"
                subTitle="Edit desccription"
              />
            </div>
          </div>
          <div className="course-custom">
            <div className="course-custom-title">
              <div className="course-custom-icon">
                <ChecklistOutlinedIcon />
              </div>
              <p>Course Chapter</p>
            </div>
            <div className="course-chapter">
              <CourseChapter
                title="Course Chapter"
                subTitle=" Add Chapter"
                onShowForm={onShowForm}
                selectChapter={handleChapterClick}
                selectedChapterId={selectedChapterId}

              />
            </div>
            <div className="course-lesson">
              <TheLesson
                title="Lesson"
                subTitle=" Add Lesson"
                selectedChapterId={selectedChapterId}
              />
              <CourseFile onFileChange={(files) => onFileChange(files)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
