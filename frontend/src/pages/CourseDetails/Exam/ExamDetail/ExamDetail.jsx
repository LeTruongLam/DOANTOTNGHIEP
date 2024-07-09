import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { scroller } from "react-scroll";
import ExamTabs from "./ExamTabs";
import ExamQuestions from "./ExamQuestions";
import ShowDialog from "@/components/Dialogs/ShowDialog";

function ExamDetail() {
  const { examId, courseId } = useParams();

  const [time, setTime] = useState(() => {
    const storedTime = localStorage.getItem(`time_${examId}`);
    return storedTime ? JSON.parse(storedTime) : 3600; // Adjust initial time as needed
  });

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
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

  const [open, setOpen] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
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
      fetchQuestions(examId).then((data) => {
        // Lọc bỏ trường `isAnswer` từ mỗi tùy chọn câu hỏi
        const cleanedQuestions = data.questions.map(question => ({
          ...question,
          QuestionOptions: question.QuestionOptions.map(option => ({
            id: option.id,
            optionImg: option.optionImg,
            optionTitle: option.optionTitle
          }))
        }));
  
        setQuestions(cleanedQuestions);
        setExamTitle(data.ExamTitle)
        setCourseTitle(data.title)
        setTime(data.TimeLimit * 60);
        localStorage.setItem(
          `questions_${examId}`,
          JSON.stringify(cleanedQuestions)
        );
      }).catch((error) => {
        console.error('Failed to fetch questions:', error);
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
  const onShowDialog = async () => {
    setOpen(true);
  };
   // Handle form submission when time reaches 0
  useEffect(() => {
    if (time === 0) {
      handleFormSubmit();
    }
  }, [time]);
  const handleFormSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:8800/api/questions/exam/${examId}/results`,
        { answers: answers },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      localStorage.removeItem(`questions_${examId}`);
      localStorage.removeItem(`answers_${examId}`);
      localStorage.removeItem(`time_${examId}`);
      localStorage.removeItem(`flags_${examId}`);
      localStorage.removeItem("startExam");

      navigate(`/course/${courseId}/exams/${examId}/overview`); // Navigate back to the previous page
    } catch (error) {
      console.error(error);
    }
  };
 

  return (
    <div ref={componentRef} className="flex pb-5 flex-col px-20">
      <div className="flex mt-10 gap-4 ">
        <ExamTabs
          time={time}
          setTime={setTime}
          questions={questions}
          activeTab={activeTab}
          flaggedQuestions={flagged}
          handleTabClick={handleTabClick}
          answers={answers}
          handleFormSubmit={handleFormSubmit}
          onShowDialog={onShowDialog}
          examTitle={examTitle}
          courseTitle={courseTitle}
        />
        <ExamQuestions
          questions={questions}
          toggleFlag={toggleFlag}
          flaggedQuestions={flagged}
          setAnswers={setAnswers}
          answers={answers}
        />
        <ShowDialog
          open={open}
          setOpen={setOpen}
          title="Bạn có chắc chắn muốn nộp bài thi không? "
          content="Hành động này sẽ hoàn thành bài thi và không thể hoàn tác."
          type="1"
          handleOke={handleFormSubmit}
        />
      </div>
    </div>
  );
}

export default ExamDetail;
