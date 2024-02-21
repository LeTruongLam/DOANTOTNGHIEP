import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CourseTitle from "./CourseTitle";
import CourseCode from "./CourseCode";
import "../course.scss";
import axios from "axios";
import { message } from "antd";

const steps = ["Enter the course title", "Enter the course code"];

export default function CourseStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [course, setCourse] = useState({ CourseId: "" });
  const navigate = useNavigate();

  const isStepOptional = (step) => {
    return step === 1;
  };

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
      message.error("Please enter the course title.");
      return;
    }

    if (activeStep === 1 && courseCode.trim() === "") {
      message.error("Please enter the course code.");
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
        "/courses",
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
    navigate(`/write?edit=${course.CourseId}`, { state: course });
  };
  return (
    <Box sx={{ width: "100%", marginTop: "20px" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
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
            Create a course and go to the edit course details page
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              onClick={handleEdit}
              sx={{ color: "white", backgroundColor: "black" }}
            >
              Finish
            </Button>
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
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Create" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
