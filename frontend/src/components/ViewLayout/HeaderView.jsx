import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
const TheHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chapterTitle, setChapterTitle] = useState("");

  const handleExit = () => {
    navigate(`/course/${location.state?.courseTitle}`, {
      state: {
        courseTitle: location.state?.courseTitle,
        courseId: location.state?.courseId,
      },
    }); // Redirect to "/" after logout
  };

  const getChapterTitle = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/courses/${location.state?.courseId}/chapters/${location.state?.chapterId}`
      );
      setChapterTitle(response.data.ChapterTitle);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getChapterTitle();
  }, [location.state?.chapterId]);
  return (
    <div className="navbar  mx-5">
      <div className="navbar-container">
        <div
          className="logo"
          style={{ display: "flex", alignItems: "center", gap: "16px" }}
        >
          <AutoStoriesOutlinedIcon />
          <b>{chapterTitle}</b>
        </div>
        <div className="links" onClick={handleExit}>
          <ExitToAppIcon />
          <span>Thoát</span>
        </div>
      </div>
    </div>
  );
};

export default TheHeader;
