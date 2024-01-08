import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./course.scss";
import { AuthContext } from "../../context/authContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";

const Course = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const cat = useLocation().search;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };
  const isAdmin = () => {
    return currentUser && currentUser.Role === "admin";
  };
  const isTeacher = () => {
    return currentUser && currentUser.Role === "teacher";
  };

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  const truncateString = (str, maxLength) => {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (isAdmin()) {
          const res = await axios.get(`/courses/all/${cat}`);
          setCourses(res.data);
        } else {
          const res = await axios.get(`/courses/${cat}`);
          setCourses(res.data);
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [cat]);
  const handleWrite = () => {
    navigate("/course/create");
  };

  return (
    <div className="section-row">
      <div className="title-course">
        <h1>My Course</h1>
        {isTeacher() && (
          <SpeedDial
            ariaLabel="SpeedDial openIcon example"
            icon={
              <SpeedDialIcon openIcon={<EditIcon />} onClick={handleWrite} />
            }
            sx={{ position: "fixed", bottom: 16, right: 16 }}
          ></SpeedDial>
        )}
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="section-items">
        {courses.map((course) => (
          <div className="course-glimpse" key={course.CourseId}>
            <Link to={`/course/${course.CourseId}`} className="link">
              <div className="course-image">
                <img src={`../upload/${course.img}`} alt="" />
              </div>
              <div className="course-content">
                <div className="course-glimpse-wrapper">
                  <div className="course-glimpse-info">
                    <p className="course-title">
                      {truncateString(getText(course.title), 35)}
                    </p>
                    <p className="course-desc">
                      {truncateString(getText(course.desc), 250)}
                    </p>
                  </div>
                  <div className="course-datetime">
                    <Chip
                      color="primary"
                      variant="outlined"
                      icon={<DateRangeIcon />}
                      label={`Starts: ${formatDate(course.StartDate)}`}
                      style={{ width: "100%", justifyContent: "flex-start" }}
                    />
                    <Chip
                      color="primary"
                      variant="outlined"
                      icon={<DateRangeIcon />}
                      label={`End: ${formatDate(course.EndDate)}`}
                      style={{
                        width: "100%",
                        justifyContent: "flex-start",
                        margin: "10px 0",
                      }}
                    />
                  </div>
                  <div className="course-glimpse-footer">
                    <p className="course-glimpse-footer-btn">Xem khóa học</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Course;
