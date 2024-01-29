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
import TheDashboard from "./pages/dashboard/TheDashboard.jsx";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/authContext.js";
import Sidebar from "./components/DashboardLayout/Sidebar.jsx";
import HeaderLayout from "./components/DashboardLayout/HeaderLayout.jsx";
const Layout = ({ children }) => (
  <>
    <TheHeader />
    {children}
  </>
);

const LayoutViewer = ({ children }) => (
  <>
    <HeaderVideo />
    {children}
  </>
);

const LayoutTeacher = ({ children }) => (
  <div className="flex gap-6">
    <Sidebar />
    <div className="w-full">
      <HeaderLayout />
      {children}
    </div>
  </div>
);

function App() {
  const { expiredToken, currentUser } = useContext(AuthContext);
  return (
    <div className="app">
      <div className="container">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/course/:id"
              element={
                !expiredToken ? (
                  <Layout>
                    <Single />
                  </Layout>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/course"
              element={
                !expiredToken ? (
                  <Layout>
                    <Course />
                  </Layout>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/course/create"
              element={
                !expiredToken ? (
                  <LayoutTeacher>
                    <CourseStepper />
                  </LayoutTeacher>
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                !expiredToken ? (
                  <LayoutTeacher>
                    <TheDashboard />
                  </LayoutTeacher>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/write"
              element={
                !expiredToken ? (
                  <LayoutTeacher>
                    <CustomerCourse />
                  </LayoutTeacher>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/info"
              element={
                !expiredToken ? (
                  <Layout>
                    <Infor />
                  </Layout>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/news"
              element={
                !expiredToken ? (
                  <Layout>
                    <FileViewer />
                  </Layout>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/course/:courseId/file/:chapterId"
              element={
                !expiredToken ? (
                  <LayoutViewer>
                    <CourseFileViewer />
                  </LayoutViewer>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/course/:courseId/chapters/:chapterId/assignment"
              element={
                !expiredToken ? (
                  <LayoutViewer>
                    <CourseAssignment />
                  </LayoutViewer>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/course/:courseId/chapter/:chapterId/lesson/:lessonId/video"
              element={
                !expiredToken ? (
                  <LayoutViewer>
                    <CourseVideo />
                  </LayoutViewer>
                ) : (
                  <Login />
                )
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
