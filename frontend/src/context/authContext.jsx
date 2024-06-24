import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { shuffleArray } from "../js/TAROHelper";
const SESSIONTIMEOUT = 10000000000000; // 10s

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [expiredToken, setExpiredToken] = useState(false);
  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8800/api/auth/login",
      inputs
    );
    setCurrentUser(res.data.userData);

    localStorage.setItem("token", res.data.token);
    // Lưu thời gian hết hạn của phiên đăng nhập vào localStorage
    const expirationTime = Date.now() + SESSIONTIMEOUT;
    localStorage.setItem("expirationTime", expirationTime);
    return res.data.userData;
  };
  // Lấy danh sách câu hỏi của bài thi
  const [questions, setQuestions] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);

  const fetchExamById = async (examId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/questions/exam/${examId}`
      );
      const randomizedQuestions = shuffleArray(response.data.questions);
      setQuestions(randomizedQuestions);
      localStorage.setItem(
        "examQuestions",
        JSON.stringify(randomizedQuestions)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChapter = async (CourseId) => {
    try {
      const reschapter = await axios.get(
        `http://localhost:8800/api/courses/${CourseId}/chapters`
      );
      setChapters(reschapter.data);
      return reschapter.data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`http://localhost:8800/api/courses`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      console.log(res.data);
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchCourseById = async (courseId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const fetchLesson = async (ChapterId) => {
    try {
      const reschapter = await axios.get(
        `http://localhost:8800/api/courses/chapters/${ChapterId}/lessons`
      );
      return reschapter.data;
    } catch (err) {
      console.log(err);
    }
  };
  const fetchAssignment = async (ChapterId) => {
    try {
      const reschapter = await axios.get(
        `http://localhost:8800/api/courses/chapters/${ChapterId}/assignments`
      );
      return reschapter.data;
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    await axios.post("http://localhost:8800/api/auth/logout");
    setCurrentUser(null);
    localStorage.clear(); // Xóa toàn bộ localStorage
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
    // Lấy thời gian hết hạn của phiên đăng nhập từ localStorage
    const expirationTime = localStorage.getItem("expirationTime");

    // Kiểm tra xem phiên đăng nhập có hết hạn chưa
    if (expirationTime && Date.now() > Number(expirationTime)) {
      logout();
      setExpiredToken(true);
      localStorage.clear(); // Xóa toàn bộ localStorage
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        courses,
        chapters,
        questions,
        flaggedQuestions,
        setFlaggedQuestions,
        fetchCourses,
        login,
        logout,
        fetchChapter,
        fetchLesson,
        fetchAssignment,
        fetchCourseById,
        fetchExamById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
