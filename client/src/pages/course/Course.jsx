import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./course.scss";
import { AuthContext } from "../../context/authContext";
import Chip from "@mui/material/Chip";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { formatDate, getText } from "../../js/TAROHelper";

const Course = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const cat = useLocation().search;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = () => {
    return currentUser && currentUser.Role === "admin";
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
      <div className="title-course mt-6 mb-3	">
        <h1 className=" font-bold text-3xl ml-3 ">My Courses</h1>
      </div>
      <div className="section-items">
        {courses.map((course) => (
          <div className="course-glimpse" key={course.CourseId}>
            <Link to={`/course/${course.CourseId}`} className="link gap-3">
              <div className="course-image">
                <img src={`../upload/${course.img}`} alt="" />
              </div>
              <div className="course-content">
                <div className="course-glimpse-wrapper">
                  <div className="course-glimpse-info">
                    <p className="course-title-main font-medium	">
                      {truncateString(getText(course.title), 35)}
                    </p>
                    <p className="course-desc  mt-3">
                      {truncateString(getText(course.desc), 250)}
                    </p>
                  </div>
                  <div className="course-datetime mt-3">
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
                  <div className="course-glimpse-footer  mt-2">
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
