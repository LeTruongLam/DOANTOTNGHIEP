import React, { useContext, useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import "../EditWrite.scss";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import LessonTitle from "../CustomerLesson/LessonTitle";
import LessonDesc from "../CustomerLesson/LessonDesc";
import LessonVideo from "../CustomerLesson/LessonVideo";
import { useNavigate } from "react-router-dom";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
const LessonStepper = ({ chapterId, handleBack, lessonId }) => {
    const navigate = useNavigate();
 
    return (
    <div className="grow-[3]">
      <div className="flex justify-between py-3 m-3 items-center	">
        <p className="text-2xl	font-semibold	">Lesson setup</p>
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
            <p className="text-xl	font-semibold	">Customer Lesson</p>
          </div>
          <LessonTitle
            chapterId={chapterId}
            lessonId={lessonId}
            title="Lesson Title"
            subTitle="Edit Title"
          />
          <div className="editorContainer">
            <LessonDesc
              chapterId={chapterId}
              lessonId={lessonId}
              title="Lesson Desccription"
              subTitle="Edit desccription"
            />
          </div>
        </div>
        <div className="course-custom">
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <VideocamOutlinedIcon />
            </div>
            <p className="text-xl	font-semibold	">Add a video</p>
          </div>
          <LessonVideo
            chapterId={chapterId}
            lessonId={lessonId}
            title="Lesson Video "
            subTitle="Edit video"
          />
        </div>
      </div>
    </div>
  );
};

export default LessonStepper;
