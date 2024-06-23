import React, { useState, useEffect } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
export default function AssignmentTitle({
  title,
  subTitle,
  chapterId,
  assignmentId,
  fetchAssignmentData,
}) {
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const getAssignmentTitle = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignments/title/${assignmentId}`
      );
      setAssignmentTitle(res.data.assignmentTitle);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAssignmentTitle();
  }, [assignmentId]);
  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignments/title/${assignmentId}`,
        {
          assignmentTitle: assignmentTitle,
        }
      );
      fetchAssignmentData();
    } catch (error) {
      console.log(error);
    }
    setIsEditing(false);
  };

  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header  mt-3 mb-3">
          <p>{title}</p>
          {!isEditing ? (
            <div onClick={handleIconClick} className="course-title-action">
              <EditIcon fontSize="small" />
              <span>{subTitle}</span>
            </div>
          ) : (
            <div onClick={handleCancelClick} className="course-title-action">
              <span>Hủy</span>
            </div>
          )}
        </div>
        <div className="course-title-body">
          {!isEditing ? (
            <div>{assignmentTitle}</div>
          ) : (
            <div className="grid">
              <TextField
                value={assignmentTitle}
                className="bg-main"
                onChange={(e) => setAssignmentTitle(e.target.value)}
              />
              <button
                className="text-white  border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
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
