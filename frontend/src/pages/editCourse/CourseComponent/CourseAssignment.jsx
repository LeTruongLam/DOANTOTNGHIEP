import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";

import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import "../EditWrite.scss";
import AssginmentForm from "../AssignmentForm/AssginmentForm";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
export default function CourseAssignment({
  title,
  subTitle,
  chapterId,
  courseId,
}) {
  const { fetchAssignment } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState();
  const fetchAssignmentData = async () => {
    try {
      if (chapterId) {
        const data = await fetchAssignment(chapterId);
        setAssignments(data); // Lưu kết quả vào state lessons
      } else {
        setAssignments([]); // Đặt state lessons thành một mảng rỗng nếu selectedChapterId không có giá trị
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignmentData();
  }, [chapterId]);

  const assignmentItems = assignments.map((assignment) => (
    <div className="bg-sub lesson-content" key={assignment.AssignmentId}>
      <div className="lesson-content-left">
        <DragIndicatorOutlinedIcon />
        {assignment.AssignmentTitle}
      </div>
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <EditIcon
          onClick={() => {
            onShowForm(assignment.AssignmentId);
          }}
          fontSize="small"
        />
        <DeleteOutlineOutlinedIcon
          onClick={() => {
            handleDeleteClick(assignment.AssignmentId);
          }}
        />
      </span>
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
      await axios.post(`http://localhost:8800/api/courses/chapters/assignments`, {
        assignmentTitle: assignmentTitle,
        chapterId: chapterId,
        courseId: courseId,
      });
      fetchAssignmentData();
    } catch (error) {
      console.log(error);
    }

    setIsEditing(false);
  };
  const handleDeleteClick = async (assignmentId) => {
    try {
      await axios.delete(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignments/${assignmentId}`
      );
      fetchAssignmentData();

      alert("Xóa thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const onShowForm = async (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setOpenForm(true);
  };

  const onCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <div className="course-title">
      {openForm && (
        <AssginmentForm
          isOpen={openForm}
          isClose={onCloseForm}
          selectedAssignmentId={selectedAssignmentId}
          chapterId={chapterId}
          assignmentId={selectedAssignmentId}
          fetchAssignmentData={fetchAssignmentData}
        ></AssginmentForm>
      )}

      <div className="course-title-wrapper">
        <div className="course-title-header  mt-3 mb-3">
          <p>{title}</p>
          {!isEditing ? (
            <div onClick={handleIconClick} className="course-title-action">
              <AddCircleOutlineOutlinedIcon fontSize="small" />
              <span>{subTitle}</span>
            </div>
          ) : (
            <div onClick={handleCancelClick} className="course-title-action ">
              <span>Cancel</span>
            </div>
          )}
        </div>
        <div className="course-title-body">
          {!isEditing ? (
            !assignments[0] ? (
              <div className="italic text-slate-400		">No assignments</div>
            ) : (
              <>{assignmentItems}</>
            )
          ) : (
            <div className="grid">
              <TextField
                className="bg-main"
                onChange={(e) => setAssignmentTitle(e.target.value)}
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
