import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";
import Button from "@mui/material/Button";

const TheHeader = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to "/" after logout
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/">
            <h6>Trang chủ</h6>
          </Link>
          <Link className="link" to="/news">
            <h6>Tin tức</h6>
          </Link>
          <Link className="link" to="/course">
            <h6>Khóa học</h6>
          </Link>
          <Link className="link" to="/teachers">
            <h6>Giảng viên</h6>
          </Link>
          <span>
            <Link to="/info">{currentUser?.UserName}</Link>
          </span>
          {currentUser ? (
            <Link to="/" onClick={handleLogout}>
              <Button variant="contained">Logout</Button>
            </Link>
          ) : (
            <div className="content">
              <Link to="/login">
                <Button variant="contained">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="contained">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheHeader;