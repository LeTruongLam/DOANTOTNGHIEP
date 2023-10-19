import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import "./course.scss";
import { AuthContext } from "../../context/authContext";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const cat = useLocation().search;
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin()) {
          const res = await axios.get(`/courses/all/${cat}`);
          setCourses(res.data);
        } else {
          const res = await axios.get(`/courses/${cat}`);
          setCourses(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat]);

  const isAdmin = () => {
    return currentUser && currentUser.Role === "admin";
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

  return (
    <div className="section-row">
      <div className="title-course">
        <h1>My Course</h1>
        {isAdmin() && <Link to="/write">Add Course</Link>}
      </div>

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
                    <p>{truncateString(getText(course.title), 20)}</p>
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