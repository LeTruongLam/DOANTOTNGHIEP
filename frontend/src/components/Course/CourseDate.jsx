import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment";

export default function CourseDate({ title, subTitle }) {
  const location = useLocation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedCourseStartDate = localStorage.getItem("startDate");
    const storedCourseEndDate = localStorage.getItem("endDate");
    if (storedCourseStartDate && storedCourseEndDate) {
      setStartDate(storedCourseStartDate);
      setEndDate(storedCourseEndDate);
    } else if (location.state) {
      setStartDate(location.state.startDate || "");
      setEndDate(location.state.endDate || "");
    }
  }, [location.state]);

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    const updatedStartDate = startDate
      ? moment(startDate).format("YYYY-MM-DD HH:mm:ss")
      : "";
    const updatedEndDate = endDate
      ? moment(endDate).format("YYYY-MM-DD HH:mm:ss")
      : "";

    try {
      await axios.put(`http://localhost:8800/api/courses/date/${location.state.CourseId}`, {
        StartDate: updatedStartDate,
        EndDate: updatedEndDate,
      });

      localStorage.setItem("startDate", updatedStartDate);
      localStorage.setItem("endDate", updatedEndDate);
    } catch (error) {
      console.log(error);
    }

    setIsEditing(false);
  };

  const onSetStartDate = (newStartDate) => {
    setStartDate(newStartDate);
  };

  const onSetEndDate = (newEndDate) => {
    setEndDate(newEndDate);
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
          {!isEditing ? (
            <div>
              {dayjs(startDate).format("DD/MM/YYYY")}
              {" - "}
              {dayjs(endDate).format("DD/MM/YYYY")}
            </div>
          ) : (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Ngày bắt đầu"
                  className="bg-main"
                  value={startDate ? dayjs(startDate) : null}
                  onChange={onSetStartDate}
                />

                <DatePicker
                  label="Ngày kết thúc"
                  value={endDate ? dayjs(endDate) : null}
                  className="bg-main"
                  onChange={onSetEndDate}
                />
              </DemoContainer>
            </LocalizationProvider>
          )}

          {isEditing && (
            <Button
              sx={{ color: "white", backgroundColor: "black" }}
              style={{ marginTop: "12px" }}
              variant="contained"
              onClick={handleSaveClick}
            >
              Lưu
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}