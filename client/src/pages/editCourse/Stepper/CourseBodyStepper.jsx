import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import "../EditWrite.scss";
import { message } from "antd";
import DropFileInput from "../../../components/DropFile/DropFileInput";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import CourseTitle from "../CourseComponent/CourseTitle";
import CourseDate from "../CourseComponent/CourseDate";
import CourseDesc from "../CourseComponent/CourseDesc";
import CourseChapter from "../CourseComponent/CourseChapter";
import CourseCode from "../CourseComponent/CourseCode";
import CourseClass from "../CourseComponent/CourseClass";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import Dialog from "../../../components/Dialogs/Dialog";

const CourseBodyStepper = ({ handleNext, setSelectedChapterId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("edit");

  const onFileChange = (files) => {
    const formData = new FormData();
    formData.append("image", files);
    axios
      .post(`/users/${courseId}/uploadImage`, formData)
      .then((response) => {
        const { imageUrl } = response.data;
        message.success("Subject image changed successfully");

        setImageUrl(imageUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEdit = (chapterId) => {
    setSelectedChapterId(chapterId);
    handleNext();
  };
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`/courses/${location.state?.CourseId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      message.success("Xóa thành công");
      navigate("/dashboard");
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };
  const onShowDialog = async () => {
    setOpen(true);
  };
  return (
    <div className="grow-[3]">
      <div className="flex justify-between py-3 m-3 items-center	">
        <Dialog
          open={open}
          setOpen={setOpen}
          title="Are you sure you want to delete course ?"
          content="This action cannot be undone. All associated data will be permanently deleted from the system."
          type="1"
          handleOke={handleDelete}
        />
        <p className="text-2xl	font-semibold	">Course Setup</p>
        <p>
          <button
            onClick={() => {
              navigate(-1);
            }}
            type="button"
            className="bg-black hover:bg-blue-500 text-white  px-2.5 py-2  rounded text-sm font-semibold	"
          >
            Back
          </button>
          <button
            onClick={onShowDialog}
            className="mr-2 rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900  ring-gray-300 hover:bg-blue-50 	"
          >
            <DeleteOutlineIcon />
          </button>
        </p>
      </div>
      <div className="course-container ">
        <div className="course-custom">
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <GridViewOutlinedIcon />
            </div>
            <p className="text-xl	font-semibold	">Customer your course</p>
          </div>
          <CourseTitle title="Course Title" subTitle="Edit Title" />
          <CourseCode title="Course Code" subTitle="Edit Code" />
          <CourseDate title="Course Date" subTitle="Edit Date" />
          <div className="course-img ">
            <DropFileInput title="Course img" onFileChange={onFileChange} />
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
            <p className="text-xl	font-semibold	">Course Chapter</p>
          </div>
          <div className="course-chapter">
            <CourseChapter
              title="Course Chapter"
              subTitle=" Add Chapter"
              handleEdit={handleEdit}
            />
          </div>
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <GroupsOutlinedIcon />
            </div>
            <p className="text-xl	font-semibold	">Class Course</p>
          </div>
          <CourseClass title="Course Classes" subTitle="Add Class" />
        </div>
      </div>
    </div>
  );
};

export default CourseBodyStepper;
