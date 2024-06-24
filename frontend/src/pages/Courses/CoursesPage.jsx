import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./course.scss";
import { getText, truncateString } from "../../js/TAROHelper";
import SchoolIcon from "@mui/icons-material/School";

const CoursesPage = () => {
  const { courses, fetchCourses } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleCourseClick = (course) => {
    navigate(`/courses/${course.CourseId}`);
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <div className="section-row mx-5">
      <div className="title-course mt-6 mb-3">
        <h1 className="font-bold text-3xl ml-3">Danh sách môn học</h1>
      </div>
      <div className="section-items">
        {courses?.map((course) => (
          <div
            className="course-glimpse  hover:cursor-pointer "
            key={course.CourseId}
          >
            <div
              className="link gap-3"
              onClick={() => handleCourseClick(course)}
            >
              <div className="course-image max-h-48">
                <img src={`${course.img}`} alt="Course Image" />
              </div>
              <div className="course-content">
                <div className="course-glimpse-wrapper">
                  <div>
                    <span className="font-semibold ">
                      <span className="text-gray-500">Tạo bởi </span>
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
                      Xem chi tiết
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

export default CoursesPage;
