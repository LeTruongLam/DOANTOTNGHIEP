import React, { useEffect, useContext } from "react";
import { AuthContext } from "@/context/authContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";

export default function TheDashboard() {
  const { courses, fetchCourses } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleEdit = async (courseId, course) => {
    navigate(`/teacher/courses/${courseId}/detail`, { state: course });
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  const handleWrite = () => {
    navigate("/teacher/courses/create");
  };

  return (
    <div className="px-5 h-screen" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="flex justify-between items-center">
        <span className="text-3xl font-bold">Danh sách môn học</span>
        <div className="my-4 flex gap-3 ">
          <button
            onClick={handleWrite}
            type="submit"
            className="flex-none rounded-md hover:bg-blue-500 focus:outline-none bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <AddCircleOutlineIcon className="mr-1" />
            Tạo môn học
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course?.CourseId}
            className="bg-slate-50 hover:cursor-pointer h-20 flex border border-gray-50 rounded-lg overflow-hidden shadow"
            onClick={() => handleEdit(course?.CourseId, course)}
          >
            <div className=" flex items-center justify-center bg-slate-500 flex-shrink-0">
              <img className="w-20 h-full object-cover" src={course?.img} />
            </div>
            <div className="flex items-center justify-between flex-grow">
              <div className="flex flex-col py-2 px-4">
                <p className="text-gray-800 font-medium line-clamp-1">
                  {course.title}
                </p>
                <p className="text-gray-700 font-semibold text-sm">
                  {course.CourseCode}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
