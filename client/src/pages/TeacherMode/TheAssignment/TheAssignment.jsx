import React, { useEffect, useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const TheAssignment = () => {
  const { courses, fetchCourses } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleEdit = async (courseTitle, courseId) => {
    navigate(`/course/${courseId}/assignments`, {
      state: { courseId: courseId, courseTitle: courseTitle },
    });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <div className="py-5 flex justify-between">
        <input
          type="text"
          name="search-course"
          id="search-course"
          autoComplete="given-name"
          placeholder="Search course"
          className=" outline-none block w-80 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        />
      </div>
      <div className="grid grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-slate-50 h-16 flex border border-gray-50 rounded-lg overflow-hidden"
            onClick={() => handleEdit(course.title, course.CourseId)}
          >
            <div className="w-16 h-full flex items-center justify-center bg-slate-500 flex-shrink-0">
              <span className="font-semibold text-white">
                {course.title
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("")}
              </span>
            </div>
            <div className="flex items-center justify-between flex-grow">
              <div className="flex flex-col py-2 px-4">
                <p className="text-gray-800 font-medium line-clamp-1">
                  {course.title}
                </p>
                <p className="text-gray-500 text-sm">{course.CourseCode}</p>
              </div>
              <div className="pr-2">
                <MoreVertIcon fontSize="small" style={{ opacity: 0.5 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default TheAssignment;
