import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import "../EditWrite.scss";
import Dropdown from "../../../components/Dropdowns/Dropdown";
export default function CourseClass({ title, subTitle }) {
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classCode, setClassCode] = useState("");

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`/classes/${location.state.CourseId}`);
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
      <Dropdown />
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
      await axios.post(`/classes/${location.state.CourseId}`, {
        classCode: classCode,
        teacherId: location.state.TeacherId,
      });
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
              <span>Cancel</span>
            </div>
          )}
        </div>
        <div>
          {!isEditing ? (
            <>
              {classes[0] ? (
                <>{classItems}</>
              ) : (
                <div className=" text-slate-400	 italic">No course class </div>
              )}
            </>
          ) : (
            <div className="grid">
              <TextField
                className="bg-main"
                onChange={(e) => setClassCode(e.target.value)}
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
