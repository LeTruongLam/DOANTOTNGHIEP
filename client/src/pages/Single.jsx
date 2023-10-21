import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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

  const { currentUser } = useContext(AuthContext);

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

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  const handleClick = (index, item) => {
    console.log(item.ChapterId);
    setOpenIndex((prevOpenIndex) => (prevOpenIndex === index ? null : index));
  };

  return (
    <div className="single">
      <div className="content">
        {course.img && (
          <img className="single-img" src={`/upload/${course.img}`} alt="" />
        )}
        <div className="user">
          {course.userImg && <img src={course.userImg} alt="" />}
          <div className="info">
            <span>{course.username}</span>
            <p>Posted {moment(course.date).fromNow()}</p>
          </div>
          {currentUser.Role === "admin" && (
            <div className="edit">
              <Link to={`/write?edit=${courseId}`} state={course}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
        </div>
        <h1>{getText(course.title)}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(course.desc),
          }}
        ></p>
        {chapterData.map((item, index) => (
          <List
            key={index}
            sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}
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
              </List>
            </Collapse>
          </List>
        ))}
      </div>
    </div>
  );
};

export default Single;
