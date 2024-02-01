import React, { useContext, useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import "../EditWrite.scss";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ChapterDesc from "../CourseForm/ChapterDesc";
import ChapterTitle from "../CourseForm/ChapterTitle";
import CourseLesson from "../CourseComponent/CourseLesson";
import { useNavigate } from "react-router-dom";
import CourseAssignment from "../CourseComponent/CourseAssignment";
const ChapterStepper = ({
  chapterId,
  handleBack,
  handleNext,
  setSelectedLessonId,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grow-[3]">
      <div className="flex justify-between py-3 m-3 items-center	">
        <p className="text-2xl	font-semibold	">Chapter Creation</p>
        <p>
          <button
            onClick={() => {
              handleBack();
            }}
            type="button"
            className="mr-2 rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900  ring-gray-300 hover:bg-blue-50 "
          >
            Back
          </button>
          <button
            onClick={() => {
              navigate(-1);
            }}
            type="button"
            className="mr-2 rounded-md bg-black	 text-white px-2.5 py-2 text-sm font-semibold text-gray-900   ring-gray-300 hover:bg-blue-500	"
          >
            Done
          </button>
        </p>
      </div>
      <div className="course-container ">
        <div className="course-custom">
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <GridViewOutlinedIcon />
            </div>
            <p className="text-xl	font-semibold	">Customer Chapter</p>
          </div>
          <ChapterTitle
            chapterId={chapterId}
            title="Chapter Title"
            subTitle="Edit Title"
          />
          <div className="editorContainer">
            <ChapterDesc
              chapterId={chapterId}
              title="Chapter Desccription"
              subTitle="Edit desccription"
            />
          </div>
        </div>
        <div className="course-custom">
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <CastForEducationIcon />
            </div>
            <p className="text-xl	font-semibold	">Customer Lessons</p>
          </div>
          <CourseLesson
            handleNext={handleNext}
            setSelectedLessonId={setSelectedLessonId}
            chapterId={chapterId}
            title="Lessons "
            subTitle="Add a lesson"
          />
        </div>
      </div>
      <div>
        <CourseAssignment
          chapterId={chapterId}
          title="Assignment"
          subTitle="Edit"
        />
      </div>
    </div>
  );
};

export default ChapterStepper;
