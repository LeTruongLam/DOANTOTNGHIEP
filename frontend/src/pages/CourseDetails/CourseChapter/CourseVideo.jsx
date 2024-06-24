import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PauseCircleOutlineSharpIcon from "@mui/icons-material/PauseCircleOutlineSharp";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import axios from "axios";
import NotFound from "@/img/Noresults.png";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
const CourseVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState([]);
  const [lessonList, setLessonList] = useState([]);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const { courseId, chapterId, lessonId } = useParams();

  const fetchLessonData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/courses/chapters/${chapterId}/lessons/${lessonId}`
      );
      console.log(response.data);
      setLesson(response.data[0]);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLessonList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/courses/chapters/${chapterId}/lessons`
      );
      setLessonList(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchLessonData();
    fetchLessonList();
  }, []);
  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  const handleToVideo = async (lessonId) => {
    navigate(`/courses/${courseId}/chapters/${chapterId}/lectures/${lessonId}`);
  };

  return (
    <>
      {loading ? (
        <>
          <Backdrop
            sx={{
              color: "rgba(0, 0, 0, 0.8)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <div className="course-video">
          <div className="container-left">
            <List
              sx={{ width: "100%", maxWidth: 350, bgcolor: "background.paper" }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              {lessonList?.map((lesson, lessonIndex) => (
                <ListItemButton
                  key={lesson.LessonId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    marginTop: lesson.LessonId === 0 ? 0 : 2,
                    borderRight:
                      lessonId === lesson.LessonId
                        ? "2px solid rgb(147 51 234)"
                        : "none",
                  }}
                  onClick={() => handleToVideo(lesson.LessonId)}
                >
                  {lessonId === lesson.LessonId ? (
                    <>
                      <PauseCircleOutlineSharpIcon
                        style={{
                          color: " rgb(147 51 234)",
                        }}
                      />
                      <ListItemText
                        style={{
                          color: " rgb(147 51 234)",
                        }}
                        primary={`Bài ${lessonIndex + 1}: ${
                          lesson.LessonTitle
                        }`}
                      />
                    </>
                  ) : (
                    <>
                      <PlayCircleOutlineIcon />
                      <ListItemText
                        primary={`Bài ${lessonIndex + 1}: ${
                          lesson.LessonTitle
                        }`}
                      />
                    </>
                  )}
                </ListItemButton>
              ))}
            </List>
          </div>
          <div className="container-right">
            {lesson?.LessonVideo ? (
              <iframe
                ref={videoRef}
                src={lesson?.LessonVideo}
                title="Chapter Video"
                className="video-player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <>
                <img className="video-player" src={NotFound} alt="Not found" />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseVideo;
