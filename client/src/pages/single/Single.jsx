import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import "./single.scss";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import ListItem from "@mui/material/ListItem";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Single = () => {
  const [chapterData, setChapterData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const nestedItems = [
    { text: "Starred" },
    { text: "Starred" },
    { text: "Starred" },
    { text: "Starred" },
  ];
  const [course, setCourse] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.pathname.split("/")[2];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.log(err);
      }
      try {
        const reschapter = await axios.get(`/courses/${courseId}/chapters`);
        setChapterData(reschapter.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [courseId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/courses/${courseId}`);
      navigate("/course");
    } catch (err) {
      console.log(err);
    }
  };
  const handleEdit = async () => {
    navigate(`/write?edit=${courseId}`, { state: course });
  };

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  const handleClick = (index, item) => {
    console.log(item.ChapterId);
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
            <h3>{getText(course.title)}</h3>
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
            <h3>Giảng viên </h3>
            <ListItem>
              <ListItemIcon>
                <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
              </ListItemIcon>
              <ListItemText primary="Lê Trường Lam" />
            </ListItem>
            <h3>Môn học bao gồm: </h3>
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
              <ListItemText primary="14 chương học" />
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
            {chapterData.map((item, index) => (
              <List
                key={index}
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  bgcolor: "#f7f9fa",
                  border: "1px solid #dfe3e6",
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <ListItemButton onClick={() => handleClick(index, item)}>
                  <ListItemText
                    primary={`Chương ${index + 1}: ${item.ChapterTitle}`}
                  />
                  {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {nestedItems.map((nestedItem, nestedIndex) => (
                      <ListItemButton key={nestedIndex} sx={{ pl: 4 }}>
                        <ListItemText primary={nestedItem.text} />
                      </ListItemButton>
                    ))}
                    <ListItemButton>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Bài tập cuối chương" />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemIcon>
                        <OndemandVideoIcon />
                      </ListItemIcon>
                      <ListItemText primary="Video chương học" />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemIcon>
                        <DescriptionIcon />
                      </ListItemIcon>
                      <ListItemText primary="Tài liệu chương học" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            ))}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Đây là chức năng nhận xét
          </CustomTabPanel>
        </Box>
      </div>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
      >
        <SpeedDialAction
          icon={<DeleteIcon />}
          tooltipTitle="Delete"
          onClick={handleDelete}
        />
        <SpeedDialAction
          icon={<EditIcon />}
          tooltipTitle="Edit"
          onClick={handleEdit}
        />
      </SpeedDial>
    </div>
  );
};

export default Single;
