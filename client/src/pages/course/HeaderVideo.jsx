import React, { useContext,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useLocation } from "react-router-dom";

const TheHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/"); // Redirect to "/" after logout
  };
  useEffect(() => {
    console.log(location.state)
  }, [location.state]);

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo">Build an LMS Platform</div>
        <div className="links" onClick={handleLogout}>
          <ExitToAppIcon />
          <span>Exit</span>
        </div>
      </div>
    </div>
  );
};

export default TheHeader;
