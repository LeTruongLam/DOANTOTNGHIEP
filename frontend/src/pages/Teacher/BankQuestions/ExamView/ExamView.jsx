import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ViewAEditDropdown from "@/components/Dropdowns/ViewAEditDropdown";
import { formatDateString } from "@/js/TAROHelper";
import { Undo2 } from "lucide-react";
function ExamView() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [exams, setExams] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8800/api/questions/exams/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      setExams(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const goBack = () => {
    navigate(`/teacher/courses/${courseId}/bankquestions`);
  };

  return (
    <div className="py-3 px-5 bg-[#F5F5F5] h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div
          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:cursor-pointer opacity-85 hover:opacity-100 rounded-md"
          onClick={goBack}
        >
          <Undo2 className="w-5 h-5" />

          <span className="text-gray-900 text-sm font-medium opacity-85">
            Quay lại
          </span>
        </div>
      </div>
      <div className="flex-grow mt-3">
        <div>
          <div className="grid grid-cols-3 gap-8">
            {exams?.map((exam, index) => (
              <div
                key={index}
                className="h-max border border-slate-200 bg-white shadow-sm rounded-md"
              >
                <div className="h-[40%] border-b border-slate-200 rounded-t-md bg-slate-50 px-3">
                  <div className="h-full py-3 flex justify-between items-center">
                    <div className="flex justify-center items-center gap-6">
                      <span className="truncate font-semibold text-gray-900">
                        {exam?.ExamTitle}
                      </span>
                    </div>
                    <div>
                      <ViewAEditDropdown examId={exam.ExamId} fetchData={fetchData} />
                    </div>
                  </div>
                </div>
                <div className="h-[60%] px-3">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span>Thời gian bắt đầu</span>
                    <span>{formatDateString(exam?.TimeStart)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span>Thời gian làm bài</span>
                    <span>{exam?.TimeLimit} Phút</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span>Số câu hỏi</span>
                    <span>{exam?.QuestionCount} </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamView;
