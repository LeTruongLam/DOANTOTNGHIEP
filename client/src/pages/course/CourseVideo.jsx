import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./course.scss";
import PauseCircleOutlineSharpIcon from "@mui/icons-material/PauseCircleOutlineSharp";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SpeedDial from "@mui/material/SpeedDial";
import axios from "axios";

const CourseVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [chapterData, setChapterData] = useState([]);
  const [chapterById, setChapterById] = useState();
  const [currentPath, setCurrentPath] = useState(location.state.currentPath);
  const [progress, setProgress] = useState(0);
  const [showNextChapterButton, setShowNextChapterButton] = useState(false);

  const courseId = location.pathname.split("/")[2];
  const videoRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/courses/${courseId}/chapters/${location.state.chapterId}`
      );
      setChapterById(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (location.state) {
      setChapterData(location.state.chapterData);
    }
    fetchData();
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

  const handleToVideo = async (ChapterId) => {
    console.log();
    navigate(`/course/${courseId}/video/${ChapterId}`, {
      state: {
        chapterData: chapterData,
        chapterId: ChapterId,
        course: location.state.course,
        currentPath: currentPath,
      },
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
        <iframe
          ref={videoRef}
          src={chapterById?.ChapterVideo}
          title="Chapter Video"
          className="video-player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <div className="chapter-content">
          <div className="chapter-title">
            <h2>{chapterById?.ChapterTitle}</h2>
          </div>
          <div className="chapter-desc">
            <span>{chapterById?.ChapterDesc}</span>
          </div>
          {showNextChapterButton && (
            <SpeedDial
              ariaLabel="SpeedDial openIcon example"
              onClick={handleNextChapter}
              icon={<SkipNextIcon />}
              sx={{ position: "fixed", bottom: 16, right: 16 }}
            ></SpeedDial>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseVideo;
