import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { scroller } from "react-scroll";
import { AuthContext } from "../../../../context/authContext";
import ExamTabs from "./ExamTabs";
import ExamQuestions from "./ExamQuestions";
import ShowDialog from "../../../../components/Dialogs/ShowDialog";

function ExamDetail() {
  const { flaggedQuestions, setFlaggedQuestions } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const { examId, courseId } = useParams();
  const [activeTab, setActiveTab] = useState(1);
  const [time, setTime] = useState();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [endTime, setEndTime] = useState();

  const navigate = useNavigate();

  function calculateEndTime(timeStart, timeLimit) {
    // Chuyển đổi thời gian bắt đầu thành đối tượng Date
    let startTime = new Date(timeStart);
    // Cộng thêm số phút vào thời gian bắt đầu
    startTime.setMinutes(startTime.getMinutes() + timeLimit);
    // Chuyển đổi lại thành chuỗi định dạng 'YYYY-MM-DD HH:mm:ss'
    let year = startTime.getFullYear();
    let month = String(startTime.getMonth() + 1).padStart(2, "0");
    let day = String(startTime.getDate()).padStart(2, "0");
    let hours = String(startTime.getHours()).padStart(2, "0");
    let minutes = String(startTime.getMinutes()).padStart(2, "0");
    let seconds = String(startTime.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  const componentRef = useRef(null);
  const fetchExamById = async (examId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/questions/exam/${examId}`
      );
      const { questions, title, ExamTitle, TimeStart, TimeLimit } =
        response.data;

      setQuestions(questions);
      setCourseTitle(title);
      setExamTitle(ExamTitle);
      const timeEnd = calculateEndTime(TimeStart, TimeLimit);

      setEndTime(timeEnd);
      setTime(TimeLimit * 60);
      localStorage.setItem("examQuestions", JSON.stringify(questions));
      localStorage.setItem("endTime", timeEnd);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExamById(examId);
  }, []);

  const handleTabClick = (questionId, index) => {
    setActiveTab(index + 1);
    scroller.scrollTo(questionId, {
      duration: 500,
      smooth: "easeInOutQuart",
    });
  };

  const toggleFlag = (questionId) => {
    setFlaggedQuestions((prevFlags) => {
      if (prevFlags.includes(questionId)) {
        return prevFlags.filter((id) => id !== questionId);
      } else {
        return [...prevFlags, questionId];
      }
    });
  };
  const onShowDialog = async () => {
    setOpen(true);
  };
  const handleFormSubmit = async () => {
    const token = localStorage.getItem("token");
    console.log("hi")
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
      navigate(`/course/${courseId}/exams/${examId}/overview`);
      localStorage.removeItem("startExam");
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
          endTime={endTime}
          questions={questions}
          activeTab={activeTab}
          flaggedQuestions={flaggedQuestions}
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
          flaggedQuestions={flaggedQuestions}
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
