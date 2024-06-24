import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
const TheHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chapterTitle, setChapterTitle] = useState("");
  const { courseId, chapterId } = useParams();

  const handleExit = () => {
    navigate(`/courses/${courseId}`); // Redirect to "/" after logout
  };

  const getChapterTitle = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/courses/${courseId}/chapters/${chapterId}`
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
