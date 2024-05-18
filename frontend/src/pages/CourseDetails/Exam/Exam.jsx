import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, CalendarClock } from "lucide-react";
import moment from "moment";

function Exam() {
  const location = useLocation();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/questions/exams/${location.state?.courseId}`
        );
        console.table(res.data);
        setExams(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [location.state?.courseId]);

  const handleExamClick = (examId) => {
    navigate(`/course/${location.state?.courseId}/exams/${examId}`);
  };

  return (
    <div className="rounded-b-lg" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="p-5">
        <ul
          role="list"
          className="divide-y divide-slate-100 flex gap-3 flex-col "
        >
          {exams.map((exam) => (
            <li
              key={exam.ExamId}
              className="flex rounded-md bg-white justify-between px-3 py-5"
            >
              <span className="flex justify-center items-center text-base font-semibold">
                {exam.ExamTitle}
              </span>
              <div className="flex justify-center items-center gap-5">
                <div className="flex justify-center items-center gap-2">
                  <CalendarClock />
                  <p className="text-sm leading-6 text-gray-900">
                    {moment(exam.TimeStart).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </div>
                <div
                  className="p-2 bg-slate-50 border rounded-md border-slate-200 hover:bg-slate-100 hover:cursor-pointer"
                  onClick={() => handleExamClick(exam.ExamId)}
                >
                  <ChevronRight />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Exam;