import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./course.scss";
import PauseCircleOutlineSharpIcon from "@mui/icons-material/PauseCircleOutlineSharp";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const CourseVideo = () => {
  const [chapterData, setChapterData] = useState([]);
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [showNextChapterButton, setShowNextChapterButton] = useState(false);

  useEffect(() => {
    // Tiến hành xử lý dữ liệu
    if (location.state) {
      setChapterData(location.state.chapterData);
    }
  }, [location.state.chapterId]);

  useEffect(() => {
    const video = videoRef.current;

    const updateProgress = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      const percentage = (currentTime / duration) * 100;
      setProgress(percentage);

      if (percentage > 80) {
        setShowNextChapterButton(true);
      } else {
        setShowNextChapterButton(false);
      }
    };

    video.addEventListener("timeupdate", updateProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const navigate = useNavigate();

  const handleToVideo = async (ChapterId) => {
    navigate(`/course/${courseId}/video/${ChapterId}`, {
      state: { chapterData: chapterData, chapterId: ChapterId },
    });
  };

  const handleNextChapter = () => {
    const currentChapterId = location.state.chapterId;
    const currentChapterIndex = chapterData.findIndex(
      (chapter) => chapter.ChapterId === currentChapterId
    );
    const nextChapterIndex = currentChapterIndex + 1;

    if (nextChapterIndex < chapterData.length) {
      const nextChapterId = chapterData[nextChapterIndex].ChapterId;
      handleToVideo(nextChapterId);
    }
  };

  return (
    <div className="course-video">
      <div className="container-left">
        <List
          sx={{ width: "100%", maxWidth: 350, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <List component="div" disablePadding>
            {chapterData.map((chapter, chapterIndex) => (
              <ListItemButton
                key={chapterIndex}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                  marginTop: chapterIndex === 0 ? 0 : 2,
                }}
                onClick={() => handleToVideo(chapter.ChapterId)}
              >
                {location.state.chapterId === chapter.ChapterId ? (
                  <PauseCircleOutlineSharpIcon />
                ) : (
                  <PlayCircleOutlineIcon />
                )}

                <ListItemText
                  primary={`Chương ${chapterIndex + 1}: ${
                    chapter.ChapterTitle
                  }`}
                />
              </ListItemButton>
            ))}
          </List>
        </List>
      </div>
      <div className="container-right">
        <video
          className="video-player"
          ref={videoRef}
          src="https://res.cloudinary.com/ddwapzxdc/video/upload/v1699848550/CourseVideo/diweokdqqn69zgfpfzvr.mp4"
          controls
        />
        <div className="chapter-content">
          <div className="chapter-title">
            <h2>1. Intro to Data and Data Science Big data</h2>
          </div>
          <div className="chapter-desc">
            <span>
              Intro to Data and Data Science Big data, business intelligence,
              business analytics, machine learning and artificial intelligence.
              We know these buzzwords belong to the field of data science but
              what do they all mean? Why learn it? As a candidate data
              scientist, you must understand the ins and outs of each of these
              areas and recognise the appropriate approach to solving a problem.
              This ‘Intro to data and data science’ will give you a
              comprehensive look at all these buzzwords and where they fit in
              the realm of data science.
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-text">{progress.toFixed(2)}%</p>
          {showNextChapterButton && (
            <button onClick={handleNextChapter}>Chuyển đến chương tiếp theo</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseVideo;