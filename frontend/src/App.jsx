import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Auth
import Login from "./pages/Auth/TheLogin/Login.jsx";
import TheRegister from "./pages/Auth/TheRegister/TheRegister.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
// User Page
import Course from "./pages/course/Course.jsx";
import CourseDetails from "./pages/CourseDetails/CourseDetails.jsx";
import CourseStepper from "./pages/course/CreateCourse/CourseStepper.jsx";
import CustomerCourse from "./pages/Teacher/editCourse/CustomerCourse.jsx";
import TheInfo from "./pages/TheInfo/TheInfo.jsx";
import CourseVideo from "./pages/course/CourseVideo.jsx";
import CourseFileViewer from "./pages/course/CourseFileViewer.jsx";
import CourseAssignment from "./pages/CourseDetails/CourseAssignment/CourseAssignment.jsx";

import ExamDetail from "./pages/CourseDetails/Exam/ExamDetail/ExamDetail.jsx";
import ExamOverview from "./pages/CourseDetails/Exam/ExamOverview/ExamOverview.jsx";
// Teacher
import TheDashboard from "./pages/Teacher/TeacherMode/TheDashboard.jsx";
import TheAssignment from "./pages/Teacher/TeacherMode/TheAssignment/TheAssignment.jsx";
import AssignmentDetail from "./pages/Teacher/TeacherMode/TheAssignment/AssignmentDetail.jsx";
import AssignmentView from "./pages/Teacher/TeacherMode/TheAssignment/AssignmentView.jsx";
import AssignmentListStudent from "./pages/Teacher/TeacherMode/TheAssignment/AssignmentListStudent.jsx";
import BankQuestions from "./pages/Teacher/TeacherMode/BankQuestions/BankQuestions.jsx";
import BankQuestionView from "./pages/Teacher/TeacherMode/BankQuestions/BankQuestionView.jsx";
import ExamView from "./pages/Teacher/TeacherMode/BankQuestions/ExamView/ExamView.jsx";
import ExamViewDetail from "./pages/Teacher/TeacherMode/BankQuestions/ExamView/ExamViewDetail/ExamViewDetail.jsx";

// Admin
import AdminPage from "./pages/Admin/AdminPage.jsx";
// Other
import PageNotFound from "./pages/NotFounds/PageNotFound.jsx";

//Router
import PrivateRouter from "./routers/PrivateRouter.jsx";
import TeacherPrivateRouter from "./routers/TeacherPrivateRouter.jsx";
import PrivateExamRouter from "./routers/PrivateExamRouter.jsx";
import AdminPrivateRouter from "./routers/AdminPrivateRouter.jsx";
// Layout
import MainLayout from "@/layout/MainLayout.jsx";
import TeacherLayout from "./layout/TeacherLayout.jsx";
import ExamLayout from "./layout/ExamLayout.jsx";
import ViewerLayout from "./layout/ViewerLayout.jsx";

const TeacherRouter = [
  {
    path: "/teacher/courses/create",
    element: <CourseStepper />,
  },
  {
    path: "/teacher/courses/:courseId/assignments",
    element: <AssignmentView />,
  },
  {
    path: "/teacher/courses/:courseId/assignments/:assignmentId/classrooms",
    element: <AssignmentListStudent />,
  },
  {
    path: "/teacher/courses/:courseId/assignments/:assignmentId/assignment-detail/:submissionId",
    element: <AssignmentDetail />,
  },
  {
    path: "/teacher/courses",
    element: <TheDashboard />,
  },
  {
    path: "/teacher/assignments",
    element: <TheAssignment />,
  },
  {
    path: "/teacher/bankquestions",
    element: <BankQuestions />,
  },
  {
    path: "/teacher/courses/:courseId/bankquestions",
    element: <BankQuestionView />,
  },
  {
    path: "/teacher/courses/:courseId/detail",
    element: <CustomerCourse />,
  },
];

function App() {
  return (
    <div className="app">
      <div className="container">
        <Router>
          <Routes>
            <Route element={<TeacherPrivateRouter />}>
              {TeacherRouter.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<TeacherLayout>{route.element}</TeacherLayout>}
                />
              ))}
            </Route>

            <Route element={<AdminPrivateRouter />}>
              <Route
                path="/admin/home"
                exact
                element={
                  <MainLayout>
                    <AdminPage />
                  </MainLayout>
                }
              />
            </Route>
            <Route element={<PrivateRouter />}>
              <Route
                path="/course/:courseTitle"
                exact
                element={
                  <MainLayout>
                    <CourseDetails />
                  </MainLayout>
                }
              />

              <Route
                path="/course/:courseId/exams/:examId/overview"
                exact
                element={
                  <MainLayout>
                    <ExamOverview />
                  </MainLayout>
                }
              />
            </Route>
            <Route element={<PrivateExamRouter />}>
              <Route
                path="/course/:courseId/exams/:examId"
                exact
                element={
                  <MainLayout>
                    <ExamDetail />
                  </MainLayout>
                }
              />
            </Route>

            <Route element={<PrivateRouter />}>
              <Route
                path="/course"
                exact
                element={
                  <MainLayout>
                    <Course />
                  </MainLayout>
                }
              />
            </Route>

            <Route element={<PrivateRouter />}>
              <Route
                path="/info"
                element={
                  <MainLayout>
                    <TheInfo />
                  </MainLayout>
                }
              />
            </Route>

            <Route element={<PrivateRouter />}>
              <Route
                path="/course/:courseTitle/document/:chapterId"
                exact
                element={
                  <ViewerLayout>
                    <CourseFileViewer />
                  </ViewerLayout>
                }
              />
            </Route>
            <Route element={<PrivateRouter />}>
              <Route
                path="/course/:courseTitle/assignment/:chapterId"
                exact
                element={
                  <ViewerLayout>
                    <CourseAssignment />
                  </ViewerLayout>
                }
              />
            </Route>
            <Route element={<PrivateRouter />}>
              <Route
                path="/course/:courseTitle/lecture/:lessonId"
                exact
                element={
                  <ViewerLayout>
                    <CourseVideo />
                  </ViewerLayout>
                }
              />
            </Route>
            <Route path="/*" element={<PageNotFound />} />
            <Route
              path="/"
              element={
                <MainLayout>
                  <HomePage />
                </MainLayout>
              }
            />
            <Route
              path="/register"
              element={
                <MainLayout>
                  <TheRegister />
                </MainLayout>
              }
            />
            <Route
              path="/login"
              element={
                <MainLayout>
                  <Login />
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
