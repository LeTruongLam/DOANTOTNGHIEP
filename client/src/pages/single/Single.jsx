import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import "./single.scss";
import { formatDate, getText } from "../../js/TAROHelper";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ListItem from "@mui/material/ListItem";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
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
        currentPath: currentPath,
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
          {course.img && <img src={`../upload/${course.img}`} alt="" />}
        </div>
        <div className="header-sub">
          <div className="header-sub-wrapper">
            {course.img && <img src={`../upload/${course.img}`} alt="" />}
            <h3 className="font-bold mt-3">{getText(course.title)}</h3>
            <ListItem>
              <ListItemIcon>
                <CalendarMonthIcon />
              </ListItemIcon>
              <ListItemText primary={`Ngày bắt đầu: ${course.StartDate}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CalendarMonthIcon />
              </ListItemIcon>
              <ListItemText primary={`Ngày kết thúc: ${course.EndDate}`} />
            </ListItem>
            <h3 className="font-bold mt-1">Giảng viên </h3>
            <ListItem>
              <ListItemIcon>
                <Avatar alt="Cindy Baker" />
              </ListItemIcon>
              <ListItemText primary={course.TeacherName} />
            </ListItem>
            <h3 className="font-bold mt-1">Môn học bao gồm: </h3>
            <ListItem>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="160 sinh viên đăng ký học" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary={`${chapterData.length} chương học`} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <OndemandVideoIcon />
              </ListItemIcon>
              <ListItemText primary="15 giờ học video" />
            </ListItem>
            <Button variant="contained" sx={{ width: "100%" }}>
              MEETING
            </Button>
          </div>
        </div>
      </div>
      <div className="single-content">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Mô tả" {...a11yProps(0)} />
              <Tab label="Danh sách bài học" {...a11yProps(1)} />
              <Tab label="Trao đổi" {...a11yProps(2)} />
              <Tab label="Danh sách lớp" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <p
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
