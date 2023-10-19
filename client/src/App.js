import {
  createBrowserRouter,
  RouterProvider,
  // Route,
  Outlet,
} from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import Home from "./pages/home/Home.jsx";
import Course from "./pages/course/Course.jsx"
import Single from "./pages/Single";
import Navbar from "./components/Navbar";
import Write from "./pages/editCourse/Write.jsx";
import Footer from "./components/Footer";
import Infor from "./pages/Info/Info.jsx"
import "./style.scss"

const Layout = () => {
  return (
    <>
      <Navbar />
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
        path:"/write",
        element: <Write/>
      },
      {
        path: "/info",
        element: <Infor />
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
    element: <Infor />
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
