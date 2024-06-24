import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import "./single.scss";
import SchoolIcon from "@mui/icons-material/School";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ClassList from "./CourseClass/ClassList";
import TheBreadcrumbs from "@/components/Breadcrumbs";
import ChapterList from "./CourseChapter/ChapterList";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Exam from "./Exam/Exam";
const CourseDetails = () => {
  const { fetchLesson } = useContext(AuthContext);
  const location = useLocation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [chapterData, setChapterData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [course, setCourse] = useState({});
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const course = await fetchCourse(token);
      const chapters = await fetchChapters(token);
      setCourse(course);
      setChapterData(chapters);
      setLoading(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCourse = async (token) => {
    const response = await axios.get(
      `http://localhost:8800/api/courses/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };

  const fetchChapters = async (token) => {
    const response = await axios.get(
      `http://localhost:8800/api/courses/${courseId}/chapters`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };
  const handleToVideo = async (chapterId, lessonId) => {
    navigate(`/courses/${courseId}/chapters/${chapterId}/lectures/${lessonId}`);
  };
  const handleToDocuments = async (ChapterId) => {
    navigate(`/courses/${courseId}/chapters/${ChapterId}/documents`);
  };
  const handleToAssignment = async (chapterId) => {
    navigate(`/courses/${courseId}/chapters/${chapterId}/assignments`);
  };

  const handleClick = async (index, item) => {
    fetchLesson(item.ChapterId);
    try {
      const res = await fetchLesson(item.ChapterId);
      setLessons(res);
    } catch (err) {
      console.log(err);
    }
    setOpenIndex((prevOpenIndex) => (prevOpenIndex === index ? null : index));
  };
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {!loading ? (
        <>
          <Backdrop
            sx={{
              color: "rgba(0, 0, 0, 0.8)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={!loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <div className="single">
          <div className="single-container ">
            <div className="header-single">
              <div className="bg-black relative min-h-20 h-[300px]">
                <div className="mx-10 w-[60%] h-full pt-5">
                  <TheBreadcrumbs courseTitle={course.title} />
                  <div className="flex items-center gap-5 ">
                    <span className="text-white font-medium py-2 px-3 bg-gray-500 rounded-lg">
                      Tạo bởi
                    </span>
                    <span className="font-medium text-white	">
                      {course?.TeacherName}
                    </span>
                  </div>
                  <div className="text-white text-4xl my-5 font-medium	">
                    {course?.title}
                  </div>
                </div>
                <div className="bg-white rounded-2xl absolute top-8 right-8 drop-shadow-2xl">
                  <div className="p-5">
                    {course?.img && (
                      <img
                        className="max-h-40 rounded-xl"
                        src={`${course?.img}`}
                        alt=""
                      />
                    )}
                    <div className=" flex flex-col gap-3  mt-3 text-gray font-semibold  w-full">
                      <ul className="flex gap-2 items-center">
                        <SchoolIcon className="text-green-500" />
                        <span>Mã môn học {course?.CourseCode}</span>
                      </ul>
                      <ul className="flex gap-2 items-center">
                        <InsertDriveFileIcon className="text-green-500" />
                        <span>{chapterData?.length} Chương học</span>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="single-content mt-4 ">
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: "12px 12px 0 0 ",
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label="Mô tả"
                    {...a11yProps(0)}
                    className="border-none outline-none focus:outline-none focus-visible:outline-none"
                    sx={{
                      textTransform: "none",

                      "&.Mui-selected": {
                        backgroundColor: "#F5F5F5", // Thay đổi màu nền của tab được chọn ở đây
                      },
                    }}
                  />
                  <Tab
                    label="Danh sách bài học"
                    {...a11yProps(1)}
                    className="border-none outline-none focus:outline-none focus-visible:outline-none"
                    sx={{
                      textTransform: "none",

                      "&.Mui-selected": {
                        backgroundColor: "#F5F5F5", // Thay đổi màu nền của tab được chọn ở đây
                      },
                    }}
                  />
                  <Tab
                    label="Danh sách lớp"
                    {...a11yProps(2)}
                    className="border-none outline-none focus:outline-none focus-visible:outline-none"
                    sx={{
                      textTransform: "none",

                      "&.Mui-selected": {
                        backgroundColor: "#F5F5F5", // Thay đổi màu nền của tab được chọn ở đây
                      },
                    }}
                  />
                  <Tab
                    label="Bài thi"
                    {...a11yProps(3)}
                    className="border-none outline-none focus:outline-none focus-visible:outline-none"
                    sx={{
                      textTransform: "none",

                      "&.Mui-selected": {
                        backgroundColor: "#F5F5F5", // Thay đổi màu nền của tab được chọn ở đây
                      },
                    }}
                  />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <p
                  style={{ backgroundColor: "#F5F5F5" }}
                  className=" p-5 rounded-b-xl "
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(course.desc),
                  }}
                ></p>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <ChapterList
                  openIndex={openIndex}
                  chapterData={chapterData}
                  lessons={lessons}
                  handleClick={handleClick}
                  handleToVideo={handleToVideo}
                  handleToAssignment={handleToAssignment}
                  handleToFile={handleToDocuments}
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <ClassList
                  courseId={courseId}
                  classCodeStudent={course?.ClassCode}
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <Exam />
              </CustomTabPanel>
            </Box>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDetails;
