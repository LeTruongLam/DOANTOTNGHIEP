import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import "./single.scss";
import { formatDate, getText } from "../../js/TAROHelper";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ClassList from "./CourseClass/ClassList";
import Comment from "./Comment/Comment";
import TheBreadcrumbs from "../../components/Breadcrumbs";
import ChapterList from "./CourseChapter/ChapterList";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
const CourseDetails = () => {
  const { fetchLesson } = useContext(AuthContext);
  const location = useLocation();
  const [courseId, setCourseId] = useState(location.state?.courseId);
  const navigate = useNavigate();
  const [chapterData, setChapterData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [course, setCourse] = useState({});
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        setCourse(res.data);
  
        const reschapter = await axios.get(`/courses/${courseId}/chapters`);
        setChapterData(reschapter.data);
        setLoading(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [courseId]);
  const handleToVideo = async (chapterId, lessonId) => {
    navigate(`/course/${location.state?.courseTitle}/lecture/${lessonId}`, {
      state: {
        chapterId: chapterId,
        lessonId: lessonId,
        courseId: courseId,
        courseTitle: location.state?.courseTitle,
      },
    });
  };
  const handleToFile = async (ChapterId) => {
    navigate(`/course/${location.state?.courseTitle}/document/${ChapterId}`, {
      state: {
        chapterId: ChapterId,
        courseId: courseId,
        courseTitle: location.state?.courseTitle,
      },
    });
  };
  const handleToAssignment = async (chapterId) => {
    navigate(`/course/${location.state?.courseTitle}/assignment/${chapterId}`, {
      state: {
        chapterId: chapterId,
        courseId: courseId,
        courseTitle: location.state?.courseTitle,
      },
    });
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
          <div className="single-container">
            <div className="header-single">
              <div className="bg-black min-h-20 h-[300px]">
                <div className="mx-10 w-[60%] h-full pt-5">
                  <TheBreadcrumbs courseTitle={course.title} />
                  <div className="flex items-center gap-5 ">
                    <span className="text-white font-medium py-2 px-3 bg-gray rounded-lg">
                      Created
                    </span>
                    <span className="text-white">
                      <span className=" text-gray-50">by </span>
                      <span className="font-medium	">{course.TeacherName}</span>
                    </span>
                  </div>
                  <div className="text-white text-4xl my-5 font-medium	">
                    {course.title}
                  </div>
                  <div className=" flex gap-5  mb-3 text-white w-full">
                    <ul className="flex gap-2 items-center">
                      <SchoolIcon
                        style={{
                          color: "rgb(101, 163, 13)",
                        }}
                      />
                      <span>{course.CourseCode}</span>
                    </ul>
                    <ul className="flex gap-2 items-center">
                      <ScheduleIcon
                        style={{
                          color: "rgb(101, 163, 13)",
                        }}
                      />
                      <span>15h</span>
                    </ul>
                    <ul className="flex gap-2 items-center">
                      <GroupsIcon
                        style={{
                          color: "rgb(101, 163, 13)",
                        }}
                      />
                      <span>160</span>
                    </ul>
                    <ul className="flex gap-2 items-center">
                      <InsertDriveFileIcon
                        style={{
                          color: "rgb(101, 163, 13)",
                        }}
                      />
                      <span>{chapterData.length}</span>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="header-sub drop-shadow-2xl">
              <div className="header-sub-wrapper">
                {course.img && <img src={`../upload/${course.img}`} alt="" />}
                <div class="flex mt-5 overview_time_discount">
                  <div class="mr-5 w-1 flex justify-center items-center bg-gradient-to-b from-transparent via-pink-400 to-transparent">
                    <div class="w-7 h-7 rounded-full px-1 bg-white flex justify-center items-center shadow-md shadow-indigo-950	 	">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="white"
                          stroke-width="2"
                          fill="transparent"
                        ></circle>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <div class="text-guid text-base">Bắt đầu</div>
                      <div class="text-lg">{formatDate(course.StartDate)}</div>
                    </div>
                    <div>
                      <div class="text-guid text-base">Kết thúc</div>
                      <div class="text-lg">{formatDate(course.EndDate)}</div>
                    </div>
                  </div>
                </div>

                {/* <Button variant="contained" sx={{ width: "100%" }}>
                  MEETING
                </Button> */}
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
                    sx={{
                      textTransform: "none",

                      "&.Mui-selected": {
                        backgroundColor: "#F5F5F5", // Thay đổi màu nền của tab được chọn ở đây
                      },
                    }}
                  />
                  <Tab
                    label="Trao đổi"
                    {...a11yProps(2)}
                    sx={{
                      textTransform: "none",
                      "&.Mui-selected": {
                        backgroundColor: "#F5F5F5", // Thay đổi màu nền của tab được chọn ở đây
                      },
                    }}
                  />
                  <Tab
                    label="Danh sách lớp"
                    {...a11yProps(3)}
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
                  handleToFile={handleToFile}
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Comment />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <ClassList
                  courseId={courseId}
                  classCodeStudent={course?.ClassCode}
                />
              </CustomTabPanel>
            </Box>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDetails;
