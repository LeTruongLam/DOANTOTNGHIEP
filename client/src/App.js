import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import Home from "./pages/home/Home.jsx";
import Course from "./pages/course/Course.jsx";
import Single from "./pages/single/Single.jsx";
import TheHeader from "./components/TheHeader.jsx";
import CourseStepper from "./pages/course/CreateCourse/CourseStepper.jsx";
import CustomerCourse from "./pages/editCourse/CustomerCourse.jsx";
import Footer from "./components/Footer";
import Infor from "./pages/Info/Info.jsx";
import CourseVideo from "./pages/course/CourseVideo.jsx";
import "./style.scss";
import HeaderVideo from "./pages/course/HeaderVideo.jsx";
import FileViewer from "./pages/FileViewer.jsx";
import CourseFileViewer from "./pages/course/CourseFileViewer.jsx";
import CourseAssignment from "./pages/course/CourseAssignment.jsx";

const Layout = ({ children }) => (
  <>
    <TheHeader />
    <Outlet />
  </>
);

const LayoutViewer = ({ children }) => (
  <>
    <HeaderVideo />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/course/:id", element: <Single /> },
      { path: "/course", element: <Course /> },
      { path: "/course/create", element: <CourseStepper /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/write", element: <CustomerCourse /> },
      { path: "/info", element: <Infor /> },
      { path: "/news", element: <FileViewer /> },
      { path: "/course/:courseId/file/:chapterId", element: <CourseFileViewer /> },
      { path: "/course/:courseId/chapters/:chapterId/assignment", element: <CourseAssignment /> },
    ],
  },

  {
    path: "/course/:courseId/chapter/:chapterId/lesson/:lessonId/video",
    element: <LayoutViewer />,
    children: [
      { path: "/course/:courseId/chapter/:chapterId/lesson/:lessonId/video", element: <CourseVideo /> },
    ],
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;