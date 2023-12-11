import {
  createBrowserRouter,
  RouterProvider,
  // Route,
  Outlet,
} from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import Home from "./pages/home/Home.jsx";
import Course from "./pages/course/Course.jsx";
import Single from "./pages/single/Single.jsx";
import TheHeader from "./components/TheHeader.jsx";
import CustomerCourse from "./pages/editCourse/CustomerCourse.jsx";
import Footer from "./components/Footer";
import Infor from "./pages/Info/Info.jsx";
import CourseVideo from "./pages/course/CourseVideo.jsx";
import "./style.scss";
import HeaderVideo from "./pages/course/HeaderVideo.jsx";
import FileViewer from "./pages/FileViewer.jsx";
import CourseFileViewer from "./pages/course/CourseFileViewer.jsx";
const Layout = () => {
  return (
    <>
      <TheHeader />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

const LayoutViewer = () => {
  return (
    <>
      <HeaderVideo />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/course/:id",
        element: <Single />,
      },
      {
        path: "/course",
        element: <Course />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/write",
        element: <CustomerCourse />,
      },
      {
        path: "/info",
        element: <Infor />,
      },
      {
        path: "/news",
        element: <FileViewer />,
      },
      {
        path: "/course/:courseId/file/:chapterId",
        element: <CourseFileViewer />,
      },
    ],
  },
  {
    path: "/register",
    element: <div>This is Register!</div>,
  },
  {
    path: "/login",
    element: <div>This is Login!</div>,
  },
  {
    path: "/single",
    element: <div>This is Single!</div>,
  },
  {
    path: "/course",
    element: <div>This is Course!</div>,
  },
  {
    path: "/write",
    element: <div>This is Course!</div>,
  },
  {
    path: "/info",
    element: <Infor />,
  },
  {
    path: "/course/:courseId/chapter/:chapterId/lesson/:lessonId/video",
    element: <LayoutViewer />,
    children: [
      {
        path: "/course/:courseId/chapter/:chapterId/lesson/:lessonId/video",
        element: <CourseVideo />,
      },
    ],
  },
]);
function App() {
  return (
    <div className="app">
      <div class="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
