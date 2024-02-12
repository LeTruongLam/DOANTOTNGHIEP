import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./course.scss";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { formatDate, getText, truncateString } from "../../js/TAROHelper";
import SchoolIcon from "@mui/icons-material/School";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const Course = () => {
  const navigate = useNavigate();
  const cat = useLocation().search;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCourseClick = (course) => {
    navigate(`/course/${course.title}`, {
      state: { courseTitle: course.title, courseId: course.CourseId },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/courses/${cat}`);
        console.table(res.data);
        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [cat]);

  return (
    <div className="section-row ml-10">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="title-course mt-6 mb-3">
        <h1 className="font-bold text-3xl ml-3">My Courses</h1>
      </div>
      <div className="section-items">
        {courses.map((course) => (
          <div className="course-glimpse" key={course.CourseId}>
            <div
              className="link gap-3"
              onClick={() => handleCourseClick(course)}
            >
              <div className="course-image">
                <img src={`../upload/${course.img}`} alt="" />
              </div>
              <div className="course-content">
                <div className="course-glimpse-wrapper">
                  <div>
                    <span className="font-normal text-base">
                      Created by <span className="font-semibold">{course.TeacherName}</span>
                    </span>
                  </div>
                  <div className="course-glimpse-info">
                    <p className="course-title-main font-semibold text-lg">
                      {truncateString(getText(course.title), 100)}
                    </p>
                  </div>
                  <div className="course-datetime mt-3">
                    <span className="flex items-center gap-2">
                      <DateRangeIcon
                        style={{
                          color: "rgb(101, 163, 13)",
                          fontSize: "medium",
                        }}
                      />
                      <span className="text-slate-500">
                        {`${formatDate(course.StartDate)} - ${formatDate(
                          course.EndDate
                        )}`}
                      </span>
                    </span>
                  </div>
                  <div>
                    <hr className="text-slate-300 mt-3" />
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p className="flex items-center gap-2 font-medium">
                      <SchoolIcon
                        style={{
                          color: "rgb(101, 163, 13)",
                          fontSize: "medium",
                        }}
                      />
                      <span>{course.CourseCode}</span>
                    </p>
                    <p className="font-medium hover:text-primary-purple hover:cursor-pointer">View More</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Course;
