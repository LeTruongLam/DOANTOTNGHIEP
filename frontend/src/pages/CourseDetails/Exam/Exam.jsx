import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, CalendarClock } from "lucide-react";

function Exam() {
  const location = useLocation();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `http://localhost:8800/api/questions/exams/${location.state?.courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExams(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [location.state?.courseId]);

  const handleExamClick = (examId) => {
    navigate(`/course/${location.state?.courseId}/exams/${examId}/overview`);
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
              className="flex rounded-md bg-white justify-between p-3 "
            >
              <span className="flex justify-center items-center text-base font-semibold">
                {exam.ExamTitle}
              </span>
              <div className="flex justify-center items-center gap-5">
                <div
                  className="p-2   rounded-md  hover:bg-slate-100 hover:cursor-pointer"
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
