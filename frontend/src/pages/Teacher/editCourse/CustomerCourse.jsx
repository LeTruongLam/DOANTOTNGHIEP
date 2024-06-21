import React, { useContext, useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import "./EditWrite.scss";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import ChapterStepper from "./Stepper/ChapterStepper";
import CourseBodyStepper from "./Stepper/CourseBodyStepper";
import LessonStepper from "./Stepper/LessonStepper";
const steps = ["Customer Course", "Customer Chapters", "Customer lessons"];

const CustomerCourse = () => {
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const CourseContent = [
    <CourseBodyStepper
      handleNext={handleNext}
      setSelectedChapterId={setSelectedChapterId}
    />,
    <ChapterStepper
      chapterId={selectedChapterId}
      setSelectedLessonId={setSelectedLessonId}
      handleBack={handleBack}
      handleNext={handleNext}
    />,
  ];
  return (
    <div className="flex gap-6">
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
          })}
        </Stepper>
        {activeStep === steps.length - 1 ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              <LessonStepper
                chapterId={selectedChapterId}
                lessonId={selectedLessonId}
                handleBack={handleBack}
                handleNext={handleNext}
              />
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              {CourseContent[activeStep]}
            </Typography>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
};

export default CustomerCourse;
