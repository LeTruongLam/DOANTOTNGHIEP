import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./course.scss";
import { AuthContext } from "../../context/authContext";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { formatDate, getText } from "../../js/TAROHelper";
import SchoolIcon from "@mui/icons-material/School";
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
          console.table(res.data);
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
                  <div>
                    <span className="font-normal	 text-base">
                      Created by {course.TeacherName}
                    </span>
                  </div>
                  <div className="course-glimpse-info">
                    <p className="course-title-main font-medium text-base			">
                      {truncateString(getText(course.title), 100)}
                    </p>
                  </div>
                  <div className="course-datetime mt-3">
                    <span className="	flex items-center gap-2">
                      <DateRangeIcon
                        style={{
                          color: "rgb(101, 163, 13)",
                          fontSize: "medium",
                        }}
                      />
                      <span className="text-slate-500">
                        {`${formatDate(course.StartDate)} -  ${formatDate(
                          course.EndDate
                        )}`}
                      </span>
                    </span>
                  </div>
                  <div>
                    <hr className="text-slate-300 mt-3" />
                  </div>
                  <div className=" mt-2 flex justify-between">
                    <p className="	flex items-center gap-2 font-medium	">
                      <SchoolIcon
                        style={{
                          color: "rgb(101, 163, 13)",
                          fontSize: "medium",
                        }}
                      />
                      <span>{course.CourseCode}</span>
                    </p>
                    <p className="font-medium	">View More</p>
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
