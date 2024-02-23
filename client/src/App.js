import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/TheLogin/Login.jsx";
import TheRegister from "./pages/TheRegister/TheRegister.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Course from "./pages/course/Course.jsx";
import CourseDetails from "./pages/CourseDetails/CourseDetails.jsx";
import TheHeader from "./components/TheHeader.jsx";
import CourseStepper from "./pages/course/CreateCourse/CourseStepper.jsx";
import CustomerCourse from "./pages/editCourse/CustomerCourse.jsx";
import TheInfo from "./pages/TheInfo/TheInfo.jsx";
import CourseVideo from "./pages/course/CourseVideo.jsx";
import "./style.scss";
import HeaderVideo from "./components/ViewLayout/HeaderView.jsx";
import TheNews from "./pages/TheNews/TheNews.jsx";
import CourseFileViewer from "./pages/course/CourseFileViewer.jsx";
import CourseAssignment from "./pages/CourseDetails/CourseAssignment/CourseAssignment.jsx";
import TheDashboard from "./pages/TeacherMode/TheDashboard.jsx";
import PageNotFound from "./pages/NotFounds/PageNotFound.jsx";
import Sidebar from "./components/DashboardLayout/Sidebar.jsx";
import HeaderLayout from "./components/DashboardLayout/HeaderLayout.jsx";
import TheAssignment from "./pages/TeacherMode/TheAssignment/TheAssignment.jsx";
import AssignmentDetail from "./pages/TeacherMode/TheAssignment/AssignmentDetail.jsx";
import PrivateRouter from "./utils/PrivateRouter.jsx";
import TeacherRouter from "./utils/TeacherRouter.jsx";
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
                  <HomePage />
                </Layout>
              }
            />
            <Route element={<PrivateRouter />}>
              <Route
                path="/course/:courseTitle"
                element={
                  <Layout>
                    <CourseDetails />
                  </Layout>
                }
              />
            </Route>
            <Route element={<PrivateRouter />}>
              <Route
                path="/course"
                element={
                  <Layout>
                    <Course />
                  </Layout>
                }
              />
            </Route>
            <Route element={<TeacherRouter />}>
              <Route
                path="/course/create"
                element={
                  <LayoutTeacher>
                    <CourseStepper />
                  </LayoutTeacher>
                }
              />
            </Route>

            <Route
              path="/register"
              element={
                <Layout>
                  <TheRegister />
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
            <Route element={<TeacherRouter />}>
              <Route
                path="/dashboard"
                element={
                  <LayoutTeacher>
                    <TheDashboard />
                  </LayoutTeacher>
                }
              />
            </Route>
            <Route element={<TeacherRouter />}>
              <Route
                path="/assignment"
                element={
                  <LayoutTeacher>
                    <TheAssignment />
                  </LayoutTeacher>
                }
              />
              <Route
                path="/assignmentDetail/:assignmentId"
                element={
                  <LayoutTeacher>
                    <AssignmentDetail />
                  </LayoutTeacher>
                }
              />
            </Route>
            <Route element={<TeacherRouter />}>
              <Route
                path="/write"
                element={
                  <LayoutTeacher>
                    <CustomerCourse />
                  </LayoutTeacher>
                }
              />
            </Route>
            <Route element={<PrivateRouter />}>
              <Route
                path="/info"
                element={
                  <Layout>
                    <TheInfo />
                  </Layout>
                }
              />
            </Route>

            <Route
              path="/news"
              element={
                <Layout>
                  <TheNews />
                </Layout>
              }
            />

            <Route element={<PrivateRouter />}>
              <Route
                path="/course/:courseTitle/document/:chapterId"
                element={
                  <LayoutViewer>
                    <CourseFileViewer />
                  </LayoutViewer>
                }
              />
            </Route>
            <Route element={<PrivateRouter />}>
              <Route
                path="/course/:courseTitle/assignment/:chapterId"
                element={
                  <LayoutViewer>
                    <CourseAssignment />
                  </LayoutViewer>
                }
              />
            </Route>
            <Route element={<PrivateRouter />}>
              <Route
                path="/course/:courseTitle/lecture/:lessonId"
                element={
                  <LayoutViewer>
                    <CourseVideo />
                  </LayoutViewer>
                }
              />
            </Route>
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
