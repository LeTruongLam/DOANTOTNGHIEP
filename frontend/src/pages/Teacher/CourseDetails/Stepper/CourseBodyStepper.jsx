import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../EditWrite.scss";
import { message } from "antd";
import DropFileInput from "@/components/DropFile/DropFileInput";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import CourseTitle from "../../../../components/Course/CourseTitle";
import CourseDesc from "../../../../components/Course/CourseDesc";
import CourseChapter from "../../../../components/Course/CourseChapter";
import CourseCode from "../../../../components/Course/CourseCode";
import CourseClass from "../../../../components/Course/CourseClass";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import Dialog from "@/components/Dialogs/ShowDialog";

const CourseBodyStepper = ({ courseId, handleNext, setSelectedChapterId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  console.log("hi", courseId);
  const onFileChange = (files) => {
    const formData = new FormData();
    formData.append("image", files);
    axios
      .post(`http://localhost:8800/api/users/${courseId}/uploadImage`, formData)
      .then((response) => {
        const { imageUrl } = response.data;
        message.success("Hình ảnh môn học đã được thay đổi thành công");
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
      await axios.delete(
        `http://localhost:8800/api/courses/${location.state?.CourseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
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
        <p className="text-2xl	font-semibold	">Thiết lập môn học</p>
        <p>
          <button
            onClick={onShowDialog}
            className="mr-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900  ring-gray-300 hover:bg-blue-50 	"
          >
            <DeleteOutlineIcon />
          </button>
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="text-white text-sm border-none bg-gray-800  py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
          >
            Quay lại
          </button>
        </p>
      </div>
      <div className="course-container ">
        <div className="course-custom">
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <GridViewOutlinedIcon />
            </div>
            <p className="text-xl	font-semibold	">Thiết lập thông tin khóa học</p>
          </div>
          <CourseTitle title="Tiêu đề môn học" subTitle="Sửa" />
          <CourseCode title="Mã môn học" subTitle="Sửa" />
          {/* <CourseDate title="Thời gian học" subTitle="Sửa" /> */}
          <div className="course-img ">
            <DropFileInput title="Ảnh môn học" onFileChange={onFileChange} />
          </div>
          <div className="editorContainer">
            <CourseDesc title="Mô tả môn học" subTitle="Sửa " />
          </div>
        </div>
        <div className="course-custom">
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <ChecklistOutlinedIcon />
            </div>
            <p className="text-xl	font-semibold	">Chương học</p>
          </div>
          <div className="course-chapter">
            <CourseChapter
              title="Chương học"
              subTitle="Thêm "
              handleEdit={handleEdit}
            />
          </div>
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <GroupsOutlinedIcon />
            </div>
            <p className="text-xl	font-semibold	">Lớp học</p>
          </div>
          <CourseClass courseId={courseId} title="Lớp học" subTitle="Thêm " />
        </div>
      </div>
    </div>
  );
};

export default CourseBodyStepper;
