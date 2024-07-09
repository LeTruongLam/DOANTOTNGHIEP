import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import ExamTabs from "./ExamTabs";
import ExamQuestions from "./ExamQuestions";
import { Undo2, Users } from "lucide-react";

function ExamViewDetail() {
  const { examId, courseId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(1);
  const [time, setTime] = useState(() => {
    const storedTime = localStorage.getItem(`time_${examId}`);
    return storedTime ? JSON.parse(storedTime) : 3600; // Adjust initial time as needed
  });
  const [questions, setQuestions] = useState(() => {
    const storedQuestions = localStorage.getItem(`questions_${examId}`);
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  });
  const [answers, setAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem(`answers_${examId}`);
    return storedAnswers ? JSON.parse(storedAnswers) : [];
  });
  const [flagged, setFlagged] = useState(() => {
    const storedFlags = localStorage.getItem(`flags_${examId}`);
    return storedFlags ? JSON.parse(storedFlags) : [];
  });

  const componentRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime > 0 ? prevTime - 1 : 0;
        localStorage.setItem(`time_${examId}`, JSON.stringify(newTime));
        return newTime;
      });
    }, 1000);

    // Handle window beforeunload event
    const handleBeforeUnload = (event) => {
      if (time > 0 || answers.length > 0 || flagged.length > 0) {
        const message =
          "Bạn đang có một bài thi đang diễn ra. Rời khỏi trang này sẽ mất toàn bộ tiến trình hiện tại. Bạn có chắc chắn muốn rời khỏi?";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [examId, time, answers, flagged]);

  useEffect(() => {
    if (questions.length === 0) {
      fetchQuestions(examId)
        .then((data) => {
          // Lọc bỏ trường `isAnswer` từ mỗi tùy chọn câu hỏi
          const cleanedQuestions = data.questions.map((question) => ({
            ...question,
            QuestionOptions: question.QuestionOptions.map((option) => ({
              id: option.id,
              optionImg: option.optionImg,
              optionTitle: option.optionTitle,
            })),
          }));

          setQuestions(cleanedQuestions);
          setTime(data.TimeLimit * 60);
          localStorage.setItem(
            `questions_${examId}`,
            JSON.stringify(cleanedQuestions)
          );
        })
        .catch((error) => {
          console.error("Failed to fetch questions:", error);
          // Xử lý lỗi nếu cần thiết
        });
    } else {
      localStorage.setItem(`questions_${examId}`, JSON.stringify(questions));
    }
  }, [questions, examId]);

  useEffect(() => {
    localStorage.setItem(`answers_${examId}`, JSON.stringify(answers));
  }, [answers, examId]);

  useEffect(() => {
    localStorage.setItem(`flags_${examId}`, JSON.stringify(flagged));
  }, [flagged, examId]);

  const fetchQuestions = async (examId) => {
    // Replace with your actual API endpoint
    const response = await fetch(
      `http://localhost:8800/api/questions/exam/${examId}`
    );
    const data = await response.json();
    return data;
  };

  const handleTabClick = (questionId, index) => {
    setActiveTab(index + 1);
    scroller.scrollTo(questionId, {
      duration: 500,
      smooth: "easeInOutQuart",
    });
  };

  const toggleFlag = (questionId) => {
    setFlagged((prevFlags) => {
      const newFlags = prevFlags.includes(questionId)
        ? prevFlags.filter((id) => id !== questionId)
        : [...prevFlags, questionId];
      localStorage.setItem(`flags_${examId}`, JSON.stringify(newFlags));
      return newFlags;
    });
  };

  const handleBackClick = () => {
    localStorage.removeItem(`questions_${examId}`);
    localStorage.removeItem(`answers_${examId}`);
    localStorage.removeItem(`time_${examId}`);
    localStorage.removeItem(`flags_${examId}`);
    navigate(`/teacher/courses/${courseId}/exams`); // Navigate back to the previous page
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
          <button className="bg-blue-700 text-sm rounded-md font-semibold text-white py-2 px-3 flex gap-1 hover:bg-green-600">
            <Users className="w-5 h-5" />
            <span>Danh sách dự thi</span>
          </button>
        </div>
      </div>

      <div className="flex mt-3 gap-4 ">
        <ExamTabs
          time={time}
          questions={questions}
          activeTab={activeTab}
          flaggedQuestions={flagged}
          handleTabClick={handleTabClick}
          answers={answers}
        />
        <ExamQuestions
          questions={questions}
          toggleFlag={toggleFlag}
          flaggedQuestions={flagged}
          setAnswers={setAnswers}
          answers={answers}
        />
      </div>
    </div>
  );
}

export default ExamViewDetail;
