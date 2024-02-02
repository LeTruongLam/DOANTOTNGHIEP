import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import Home from "./pages/home/Home.jsx";
import Course from "./pages/course/Course.jsx";
import Single from "./pages/single/Single.jsx";
import TheHeader from "./components/TheHeader.jsx";
import CourseStepper from "./pages/course/CreateCourse/CourseStepper.jsx";
import CustomerCourse from "./pages/editCourse/CustomerCourse.jsx";
import Infor from "./pages/Info/Info.jsx";
import CourseVideo from "./pages/course/CourseVideo.jsx";
import "./style.scss";
import HeaderVideo from "./components/ViewLayout/HeaderView.jsx";
import FileViewer from "./pages/FileViewer.jsx";
import CourseFileViewer from "./pages/course/CourseFileViewer.jsx";
import CourseAssignment from "./pages/course/CourseAssignment.jsx";
import { useContext } from "react";
import TheDashboard from "./pages/TeacherMode/TheDashboard.jsx";
import { AuthContext } from "./context/authContext.js";
import Sidebar from "./components/DashboardLayout/Sidebar.jsx";
import HeaderLayout from "./components/DashboardLayout/HeaderLayout.jsx";
import TheAssignment from "./pages/TeacherMode/TheAssignment.jsx";
const Layout = ({ children }) => (
  <>
    <TheHeader />
    {children}
  </>
);

const LayoutViewer = ({ children }) => (
  <>
    <HeaderVideo />
    <div className="mr-4">{children}</div>
  </>
);

const LayoutTeacher = ({ children }) => (
  <div className="flex gap-6">
    <Sidebar />
    <div className="w-full mr-5">
      <HeaderLayout />
      {children}
    </div>
  </div>
);

function App() {
  return (
    <div className="app">
      <div className="container">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/course/:id"
              element={
                <Layout>
                  <Single />
                </Layout>
              }
            />
            <Route
              path="/course"
              element={
                <Layout>
                  <Course />
                </Layout>
              }
            />
            <Route
              path="/course/create"
              element={
                <LayoutTeacher>
                  <CourseStepper />
                </LayoutTeacher>
              }
            />
            <Route
              path="/register"
              element={
                <Layout>
                  <Register />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <LayoutTeacher>
                  <TheDashboard />
                </LayoutTeacher>
              }
            />
            <Route
              path="/assignment"
              element={
                <LayoutTeacher>
                  <TheAssignment />
                </LayoutTeacher>
              }
            />
            <Route
              path="/write"
              element={
                <LayoutTeacher>
                  <CustomerCourse />
                </LayoutTeacher>
              }
            />
            <Route
              path="/info"
              element={
                <Layout>
                  <Infor />
                </Layout>
              }
            />
            <Route
              path="/news"
              element={
                <Layout>
                  <FileViewer />
                </Layout>
              }
            />
            <Route
              path="/course/:courseId/file/:chapterId"
              element={
                <LayoutViewer>
                  <CourseFileViewer />
                </LayoutViewer>
              }
            />
            <Route
              path="/course/:courseId/chapters/:chapterId/assignment"
              element={
                <LayoutViewer>
                  <CourseAssignment />
                </LayoutViewer>
              }
            />
            <Route
              path="/course/:courseId/chapter/:chapterId/lesson/:lessonId/video"
              element={
                <LayoutViewer>
                  <CourseVideo />
                </LayoutViewer>
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
