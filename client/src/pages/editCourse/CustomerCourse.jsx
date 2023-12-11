import React, { useContext, useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./EditWrite.scss";

import DropFileInput from "../../components/drop-file-input/DropFileInput";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import ChapterForm from "./CourseForm/ChapterForm";
import CourseTitle from "./CourseComponent/CourseTitle";
import CourseDate from "./CourseComponent/CourseDate";
import CourseDesc from "./CourseComponent/CourseDesc";
import CourseChapter from "./CourseComponent/CourseChapter";
import CourseLesson from "./CourseComponent/CourseLesson";
import CourseCode from "./CourseComponent/CourseCode";
import CourseClass from "./CourseComponent/CourseClass";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
const CustomerCourse = () => {
  const { fetchChapter } = useContext(AuthContext);
  const location = useLocation();

  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [chapterData, setChapterData] = useState([]);
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
    console.log(location.state);
    fetchData();
  }, []);

  // const handleDeleteChapter = async (chapterId) => {
  //   try {
  //     await axios.delete(`/courses/${chapterId}/chapters`);
  //     fetchData();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
        <div className="course-custom-title">
          <div className="course-custom-icon">
            <GroupsOutlinedIcon />
          </div>
          <p>Class Course</p>
        </div>
        <CourseClass title="Course Classes" subTitle="Add Class" />

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
            <CourseTitle title="Course Title" subTitle="Edit Title" />
            <CourseCode title="Course Code" subTitle="Edit Code" />
            <CourseDate title="Course Date" subTitle="Edit Date" />
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
              <CourseLesson
                title="Course Lesson"
                subTitle=" Add Lesson"
                selectedChapterId={selectedChapterId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCourse;
