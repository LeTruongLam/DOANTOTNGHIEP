import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import CourseTitle from "./CourseTitle";
import CourseCode from "./CourseCode";
import axios from "axios";
import { message } from "antd";

const steps = ["Nhập tên môn học", "Nhập mã môn học"];

export default function CourseStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [course, setCourse] = useState({ CourseId: "" });
  const navigate = useNavigate();

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === 0 && courseTitle.trim() === "") {
      message.error("Vui lòng nhập tên môn học.");
      return;
    }

    if (activeStep === 1 && courseCode.trim() === "") {
      message.error("Vui lòng nhập mã môn học.");
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);

    if (activeStep === steps.length - 1) {
      handleSaveClick();
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:8800/api/courses",
        {
          courseTitle: courseTitle,
          courseCode: courseCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      setCourse((prevCourse) => ({
        ...prevCourse,
        CourseId: response.data.courseId,
      }));
      message.success(response.data.message);
    } catch (error) {
      message.error(error.message);
    }
  };
  const handleEdit = async () => {
    navigate(`/course/write?edit=${course.CourseId}`, { state: course });
  };
  return (
    <div className="px-5">
      <Box sx={{ width: "100%", marginTop: "20px" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Tạo một môn học và đi đến trang chỉnh sửa chi tiết khóa môn
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <button
                onClick={handleEdit}
                className={` bg-blue-700 hover:bg-blue-600 focus:outline-none  px-3 py-1 rounded-md font-semibold text-white`}
              >
                Hoàn thành
              </button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              {activeStep === 0 && (
                <CourseTitle
                  courseTitle={courseTitle}
                  setCourseTitle={setCourseTitle}
                />
              )}
              {activeStep === 1 && (
                <CourseCode
                  courseCode={courseCode}
                  setCourseCode={setCourseCode}
                />
              )}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <button
                className={`border focus:outline-none hover:bg-slate-100  border-blue-500 px-3 py-1 rounded-md font-semibold ${
                  activeStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Quay lại
              </button>
              <Box sx={{ flex: "1 1 auto" }} />
              <button
                onClick={handleNext}
                className={` bg-blue-700 focus:outline-none hover:bg-blue-600  px-3 py-1 rounded-md font-semibold text-white`}
              >
                {activeStep === steps.length - 1 ? "Tạo" : "Tiếp theo"}
              </button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
}
