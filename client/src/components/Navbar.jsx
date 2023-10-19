import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";
const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="container">
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
          <span><Link to="/info">{currentUser?.UserName}</Link></span>
          {currentUser ? (
            <a href="/" onClick={logout}>Logout</a>
          ) : (
            <div className="content">
              <Link className="link" to="/login">
                Login
              </Link>
              <Link className="link" to="/register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
