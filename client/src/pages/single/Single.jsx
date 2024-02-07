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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ClassList from "./ClassList";
import Comment from "./Comment";
import ChapterList from "./ChapterList";
const Single = () => {
  const { fetchLesson } = useContext(AuthContext);
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [chapterData, setChapterData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [course, setCourse] = useState({});
  const [lessons, setLessons] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/courses/${courseId}`);
        setCourse(res.data);
        console.table(res.data)
        const reschapter = await axios.get(`/courses/${courseId}/chapters`);
        setChapterData(reschapter.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [courseId]);
  const handleToVideo = async (chapterId, lessonId) => {
    navigate(
      `/course/${courseId}/chapter/${chapterId}/lesson/${lessonId}/video`,
      {
        state: {
          chapterId: chapterId,
          lessonId: lessonId,
          currentPath: currentPath,
        },
      }
    );
  };
  const handleToFile = async (ChapterId) => {
    navigate(`/course/${courseId}/file/${ChapterId}`, {
      state: {
        chapterId: ChapterId,
        currentPath: currentPath,
      },
    });
  };
  const handleToAssignment = async (chapterId) => {
    navigate(`/course/${courseId}/chapters/${chapterId}/assignment`, {
      state: {
        chapterId: chapterId,
        courseId: courseId,
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
    <div className="single">
      <div className="single-container">
        <div className="header-single">
          <div className="bg-black min-h-20 h-[300px]">
            <div className="mx-10 w-[60%] h-full pt-5">
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
            <ListItem>
              <ListItemIcon>
                <CalendarMonthIcon
                  style={{
                    color: "rgb(101, 163, 13)",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={`Ngày bắt đầu: ${formatDate(course.StartDate)}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CalendarMonthIcon
                  style={{
                    color: "rgb(101, 163, 13)",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={`Ngày kết thúc: ${formatDate(course.EndDate)}`} />
            </ListItem>
            <Button variant="contained" sx={{ width: "100%" }}>
              MEETING
            </Button>
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
  );
};

export default Single;
