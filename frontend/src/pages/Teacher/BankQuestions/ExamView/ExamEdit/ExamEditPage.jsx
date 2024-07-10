import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Undo2 } from "lucide-react";
import QuestionsList from "./QuestionsList";
import ExamInfor from "./ExamInfor";
import dayjs from "dayjs";
import { formattedDateTime } from "@/js/TAROHelper";
import { message } from "antd";
import axios from "axios";

function ExamEditPage() {
  const { examId, courseId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIds, setQuestionIds] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [timeLimit, setTimeLimit] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const navigate = useNavigate();
  const componentRef = useRef(null);

  const fetchExam = async (examId) => {
    try {
      const response = await fetch(
        `http://localhost:8800/api/questions/exam/${examId}`
      );
      const data = await response.json();
      setExam(data);
      setQuestions(data.questions);
      setQuestionIds(data.questions.map((question) => question.QuestionId));
      setExamTitle(data.ExamTitle);
      setExamDescription(data.ExamDescription);
      setStartTime(dayjs(data.TimeStart));
      setTimeLimit(data.TimeLimit);
      setAccessCode(data.AccessCode);
    } catch (error) {
      console.error("Failed to fetch exam data:", error);
    }
  };

  useEffect(() => {
    if (examId) {
      fetchExam(examId);
    }
  }, [examId]);

  const handleBackClick = () => {
    navigate(`/teacher/courses/${courseId}/exams`);
  };
  const handleSave = async () => {
    const validateForm = () => {
      if (examTitle.trim() === "") {
        message.error("Tiêu đề bài thi không được bỏ trống");
        return false;
      }

      return true;
    };

    const createExam = async () => {};
    try {
      const formatStartTime = formattedDateTime(startTime);

      const payload = {
        examTitle: examTitle,
        examDescription: examDescription,
        startTime: formatStartTime,
        timeLimit: timeLimit,
        accessCode: accessCode,
        questionIds: questionIds,
      };
      const response = await axios.put(
        `http://localhost:8800/api/questions/exam/${examId}`,
        payload
      );
      message.success("Sửa thông tin bài thi thành công");
    } catch (error) {
      console.log("Error:", error);
    }
    if (validateForm()) {
      await createExam();
    }
  };
  return (
    <div ref={componentRef} className="flex py-5 flex-col px-5">
      <div className="">
        <div className="flex justify-between items-center border-b pb-3 border-slate-200">
          <div
            onClick={handleBackClick}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:cursor-pointer opacity-85 hover:opacity-100 rounded-md"
          >
            <Undo2 className="w-5 h-5" />
            <span className="text-gray-900 text-sm font-medium opacity-85">
              Quay lại
            </span>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-700 text-sm rounded-md font-semibold text-white py-2 px-3 flex gap-1 hover:bg-green-600"
          >
            <span>Lưu</span>
          </button>
        </div>

        <div className="flex gap-8 mt-5 ">
          <div className="basis-2/5">
            {exam && (
              <ExamInfor
                examTitle={examTitle}
                setExamTitle={setExamTitle}
                examDescription={examDescription}
                setExamDescription={setExamDescription}
                startTime={startTime}
                setStartTime={setStartTime}
                timeLimit={timeLimit}
                setTimeLimit={setTimeLimit}
                accessCode={accessCode}
                setAccessCode={setAccessCode}
              />
            )}
            {/* Pass the exam data as props */}
          </div>
          <div className="basis-3/5">
            {exam && (
              <QuestionsList
                questions={questions}
                setQuestions={setQuestions}
                setQuestionIds={setQuestionIds}
              />
            )}{" "}
            {/* Pass the questions data as props */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamEditPage;
