import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Undo2 } from "lucide-react";

export default function StudentListPage() {
  const { courseId, classId } = useParams();
  const [classData, setClassData] = useState();
  const [classStudent, setClassStudent] = useState([]);
  const navigate = useNavigate();
  const fetchClassStudent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/classes/${courseId}/classes/${classId}/classStudent`
      );
      setClassStudent(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClass = async () => {
    console.log(classId);
    try {
      const res = await axios.get(
        `http://localhost:8800/api/classes/${courseId}/classes/${classId}`
      );
      setClassData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClassStudent();
  }, [classId]);
  useEffect(() => {
    fetchClass();
  }, []);
  const handleBackClick = () => {
    navigate(`/teacher/courses/${courseId}/detail`); // Navigate back to the previous page
  };
  return (
    <div className="rounded-b-lg pt-5" style={{ backgroundColor: "#F5F5F5" }}>
      <div
        onClick={handleBackClick}
        className="flex w-max ml-5 items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:cursor-pointer opacity-85 hover:opacity-100 rounded-md"
      >
        <Undo2 className="w-5 h-5" />
        <span className="text-gray-900 text-sm font-medium opacity-85">
          Quay lại
        </span>
      </div>
      <div className="p-5">
        <div className="class-container bg-white">
          <div className="class-wrapper">
            <div className="class-title">
              Tên lớp học : {classData?.ClassCode}
            </div>
            <div className="class-header font-bold mt-3">
              <p>Danh sách lớp ({classStudent?.length})</p>
            </div>

            {classStudent.map((student, index) => (
              <div className="student-info mt-3" key={index}>
                <div>
                  <Avatar alt={student?.StudentName} />
                </div>
                <div>
                  <p>
                    <b>{student?.StudentName}</b>
                  </p>
                  <p>{student?.StudentCode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
