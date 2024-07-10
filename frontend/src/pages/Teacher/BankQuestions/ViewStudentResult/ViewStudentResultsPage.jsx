import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SelectClass from "./SelectClass";
import StudentResultsTable from "./StudentResultsTable";
import { Undo2 } from "lucide-react";
import * as XLSX from "xlsx";

const ViewStudentResultsPage = () => {
  const [exam, setExam] = useState();
  const [classes, setClasses] = useState([]);
  const { examId, courseId } = useParams();
  const [studentResults, setStudentResults] = useState([]);
  const [classId, setClassId] = useState();
  const [selected, setSelected] = useState();
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/questions/exam/${examId}/classes`
      );
      setClasses(response.data);
      setSelected(response.data[0]);
      setClassId(response.data[0].ClassId);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchExam = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/questions/exam/${examId}`
      );
      setExam(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchExamResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/questions/exam/${examId}/classes/${classId}`
      );
      setStudentResults(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExam();
    fetchClasses();
  }, []);

  useEffect(() => {
    if (classId) {
      fetchExamResults();
    }
  }, [classId]);

  const handleBackClick = () => {
    navigate(`/teacher/courses/${courseId}/exams/${examId}`); // Navigate back to the previous page
  };

  const exportToExcel = () => {
    const filteredData = studentResults.map(
      ({ StudentName, StudentCode, Score }, index) => ({
        STT: index + 1,
        StudentName,
        StudentCode,
        Score: Score ?? "-", // If Score is null or undefined, show "-"
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Results");

    // Lấy CourseCode và ClassCode để đặt tên tệp
    const courseCode = exam?.CourseCode ?? "CourseCode";
    const classCode = selected?.ClassCode ?? "ClassCode";
    const fileName = `${courseCode}-${classCode}.xlsx`;

    // Xuất file Excel
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="px-5">
      <div className="flex justify-between items-center px-3 mt-3 border-b border-slate-300 pb-3">
        <span className="text-xl font-bold text-blue-600">
          {exam?.title} - {exam?.ExamTitle}
        </span>
      </div>
      <div
        className="rounded-b-lg min-h-[600px]"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <div className="p-3 pb-0 flex justify-between items-center">
          <div
            onClick={handleBackClick}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:cursor-pointer opacity-85 hover:opacity-100 rounded-md"
          >
            <Undo2 className="w-5 h-5" />
            <span className="text-gray-900 text-sm font-medium opacity-85">
              Quay lại
            </span>
          </div>
          <div className="flex gap-3">
            <SelectClass
              selected={selected}
              classes={classes}
              setSelected={setSelected}
              setClassId={setClassId}
            />
            <button
              onClick={exportToExcel}
              className=" px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Xuất Excel
            </button>
          </div>
        </div>
        <StudentResultsTable studentResults={studentResults} />
      </div>
    </div>
  );
};

export default ViewStudentResultsPage;
