import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import "../EditWrite.scss";
import Dropdown from "../../../components/Dropdowns/Dropdown";
import { message } from "antd";
export default function CourseClass({ courseId, title, subTitle }) {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classCode, setClassCode] = useState("");

  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/classes/${courseId}`
      );
      setClasses(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, []);

  const classItems = classes.map((classItem) => (
    <div className="bg-sub lesson-content" key={classItem.ClassId}>
      <div className="lesson-content-left">
        <ClassOutlinedIcon />
        {classItem.ClassCode}
      </div>
      <Dropdown classId={classItem.ClassId} fetchClasses={fetchClasses} />
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
      await axios.post(`http://localhost:8800/api/classes/${courseId}`, {
        classCode: classCode,
        teacherId: location.state.TeacherId,
      });
      message.success("Tạo thành công");
    } catch (error) {
      console.log(error);
    }
    fetchClasses();
    setIsEditing(false);
  };

  return (
    <div className="course-title overflow-visible	py-0.5">
      <div className="course-title-wrapper">
        <div className="course-title-header   mt-3 mb-3">
          <p>{title}</p>
          {!isEditing ? (
            <div
              onClick={handleIconClick}
              className="course-title-action items-center	"
            >
              <AddCircleOutlineOutlinedIcon fontSize="small" />
              <span>{subTitle}</span>
            </div>
          ) : (
            <div onClick={handleCancelClick} className="course-title-action">
              <span>Hủy</span>
            </div>
          )}
        </div>
        <div>
          {!isEditing ? (
            <>
              {classes[0] ? (
                <>{classItems}</>
              ) : (
                <div className=" text-slate-400	 italic">Không có lớp học </div>
              )}
            </>
          ) : (
            <div className="grid">
              <TextField
                className="bg-main"
                onChange={(e) => setClassCode(e.target.value)}
              />
              <button
                className="text-white border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
                onClick={handleSaveClick}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
