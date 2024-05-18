import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import dayjs from "dayjs";
import "../EditWrite.scss";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment";

export default function AssignmentDate({
  title,
  subTitle,
  chapterId,
  assignmentId,
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const getAssignmentDate = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignments/date/${assignmentId}`
      );
      setStartDate(res.data.startDate);
      setEndDate(res.data.endDate);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAssignmentDate();
  }, [assignmentId]);

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    const updatedStartDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
    const updatedEndDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");

    try {
      await axios.put(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignments/date/${assignmentId}`,
        {
          startDate: updatedStartDate,
          endDate: updatedEndDate,
        }
      );
    } catch (error) {
      console.log(error);
    }

    setIsEditing(false);
  };

  const onSetStartDate = (newStartDate) => {
    const formattedStartDate = newStartDate.format("YYYY-MM-DD HH:mm:ss");
    setStartDate(formattedStartDate);
  };

  const onSetEndDate = (newEndDate) => {
    const formattedEndDate = newEndDate.format("YYYY-MM-DD HH:mm:ss");
    setEndDate(formattedEndDate);
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
                  onChange={onSetStartDate}
                />

                <DatePicker
                  label="Ngày kết thúc"
                  value={dayjs(endDate)}
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
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
