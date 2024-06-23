import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

export default function AssignmentDate({
  title,
  subTitle,
  chapterId,
  fetchAssignmentData,
  assignmentId,
}) {
  const [endDate, setEndDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getAssignmentDate = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/courses/chapters/${chapterId}/assignments/date/${assignmentId}`
        );
        setEndDate(dayjs(res.data.endDate));
      } catch (error) {
        console.error(error);
      }
    };
    getAssignmentDate();
  }, [chapterId, assignmentId]);

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignments/date/${assignmentId}`,
        {
          endDate: endDate.format("YYYY-MM-DD HH:mm:ss"),
        }
      );
      setIsEditing(false);
      fetchAssignmentData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header  mt-3 mb-3">
          <p>{title}</p>
          {!isEditing ? (
            <div
              onClick={handleIconClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <EditIcon fontSize="small" />
              <span>{subTitle}</span>
            </div>
          ) : (
            <div
              onClick={handleCancelClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <span>Hủy</span>
            </div>
          )}
        </div>
        <div className="course-title-body">
          {endDate && (
            <>
              {!isEditing ? (
                <div>{endDate.format("DD/MM/YYYY HH:mm:ss")}</div>
              ) : (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DateTimePicker", "MobileDateTimePicker"]}
                  >
                    <MobileDateTimePicker
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {isEditing && (
                <button
                  className="text-white  border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
                  onClick={handleSaveClick}
                >
                  Lưu
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
