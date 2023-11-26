import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useLocation } from "react-router-dom";

const TheHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate(location.state.currentPath); // Redirect to "/" after logout
  };
  useEffect(() => {
    console.log(location.state);
  }, [location.state]);

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <b>{location.state.course.title}</b>
        </div>
        <div className="links" onClick={handleLogout}>
          <ExitToAppIcon />
          <span>Exit</span>
        </div>
      </div>
    </div>
  );
};

export default TheHeader;
