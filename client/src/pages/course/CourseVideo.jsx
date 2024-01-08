import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./course.scss";
import PauseCircleOutlineSharpIcon from "@mui/icons-material/PauseCircleOutlineSharp";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import axios from "axios";

const CourseVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState([]);
  const [lessonList, setLessonList] = useState([]);
  const [currentPath, setCurrentPath] = useState(location.state.currentPath);

  const courseId = location.pathname.split("/")[2];
  const videoRef = useRef(null);
  const fetchLessonData = async () => {
    try {
      const response = await axios.get(
        `/courses/chapters/${location.state.chapterId}/lessons/${location.state.lessonId}`
      );
      setLesson(response.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLessonList = async () => {
    try {
      const response = await axios.get(
        `/courses/chapters/${location.state.chapterId}/lessons`
      );
      setLessonList(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchLessonData();
    fetchLessonList();
  }, [location.state.lessonId]);

  const handleToVideo = async (lessonId) => {
    const chapterId = location.state.chapterId;
    navigate(
      `/course/${courseId}/chapter/${chapterId}/lesson/${lessonId}/video`,
      {
        state: {
          chapterId: chapterId,
          lessonId: lessonId,
          currentPath: currentPath,
        },
      }
    );
  };

  return (
    <div className="course-video">
      <div className="container-left">
        <List
          sx={{ width: "100%", maxWidth: 350, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {lessonList.map((lesson, lessonIndex) => (
            <ListItemButton
              key={lessonIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                marginTop: lessonIndex === 0 ? 0 : 2,
              }}
              onClick={() => handleToVideo(lesson.LessonId)}
            >
              {location.state.lessonId === lesson.LessonId ? (
                <PauseCircleOutlineSharpIcon />
              ) : (
                <PlayCircleOutlineIcon />
              )}

              <ListItemText
                primary={`Lesson ${lessonIndex + 1}: ${lesson.LessonTitle}`}
              />
            </ListItemButton>
          ))}
        </List>
      </div>
      <div className="container-right">
        <iframe
          ref={videoRef}
          src={lesson?.LessonVideo}
          title="Chapter Video"
          className="video-player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <div className="chapter-content">
          <div className="chapter-title">
            <h2>{lesson?.LessonTitle}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseVideo;
