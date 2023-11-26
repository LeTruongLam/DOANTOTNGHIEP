import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import "../EditWrite.scss";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment";

export default function CourseDate({ title, subTitle }) {
  const location = useLocation();
  const [startDate, setStartDate] = useState(location.state?.StartDate || "");
  const [endDate, setEndDate] = useState(location.state?.EndDate || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedCourseStartDate = localStorage.getItem("startDate");
    const storedCourseEndDate = localStorage.getItem("endDate");
    if (storedCourseStartDate || storedCourseEndDate) {
      setStartDate(storedCourseStartDate);
      setEndDate(storedCourseEndDate);
    } else {
      setStartDate(location.state?.startDate || "");
      setEndDate(location.state?.endDate || "");
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
      : (location.state && location.state.startDate) || "";
    const updatedEndDate = endDate
      ? moment(endDate).format("YYYY-MM-DD HH:mm:ss")
      : (location.state && location.state.endDate) || "";

    try {
      await axios.put(`/courses/date/${location.state.CourseId}`, {
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

  const onSetStartDate = (startDate) => {
    const newStartDate = startDate.format("YYYY-MM-DD HH:mm:ss");
    setStartDate(newStartDate);
  };

  const onSetEndDate = (endDate) => {
    const newEndDate = endDate.format("YYYY-MM-DD HH:mm:ss");
    setEndDate(newEndDate);
  };

  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header">
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
              <span>Cancel</span>
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
                  value={dayjs(startDate)}
                  onChange={(newStartDate) => onSetStartDate(newStartDate)}
                />

                <DatePicker
                  label="Ngày kết thúc"
                  value={dayjs(endDate)}
                  className="bg-main"
                  onChange={(newEndDate) => onSetEndDate(newEndDate)}
                />
              </DemoContainer>
            </LocalizationProvider>
          )}

          {isEditing && (
            <Button
              style={{ marginTop: "12px" }}
              variant="contained"
              onClick={handleSaveClick}
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
