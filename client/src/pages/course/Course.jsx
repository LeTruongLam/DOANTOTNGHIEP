import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./course.scss";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { formatDate, getText, truncateString } from "../../js/TAROHelper";
import SchoolIcon from "@mui/icons-material/School";

const Course = () => {
  const { courses, fetchCourses } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleCourseClick = (course) => {
    navigate(`/course/${course.title}`, {
      state: { courseTitle: course.title, courseId: course.CourseId },
    });
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <div className="section-row mx-5">
      <div className="title-course mt-6 mb-3">
        <h1 className="font-bold text-3xl ml-3">My Courses</h1>
        <input
          type="text"
          name="search-course"
          id="search-course"
          autoComplete="given-name"
          placeholder="Search course"
          className="mr-10 outline-none block w-80 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        />
      </div>
      <div className="section-items">
        {courses.map((course) => (
          <div className="course-glimpse" key={course.CourseId}>
            <div
              className="link gap-3"
              onClick={() => handleCourseClick(course)}
            >
              <div className="course-image">
                <img src={`../upload/${course.img}`} alt="Course Image" />
              </div>
              <div className="course-content">
                <div className="course-glimpse-wrapper">
                  <div>
                    <span className="font-normal text-base">
                      Created by{" "}
                      <span className="font-semibold">
                        {course.TeacherName}
                      </span>
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
                    <p className="font-medium hover:text-primary-purple hover:cursor-pointer">
                      View More
                    </p>
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
