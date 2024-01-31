import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./course.scss";
import { ImageConfig } from "../../config/ImageConfig.js";
import { formatDate, getText } from "../../js/TAROHelper";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
export default function CourseAssignment() {
  const location = useLocation();
  const navigate = useNavigate();
  const listRef = useRef(null);

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  const [assignment, setAssignment] = useState([]);
  const [assignmentList, setAssignmentList] = useState([]);
  const [attachFile, setAttachFile] = useState([]);

  const fetchAssignmentData = async () => {
    try {
      const response = await axios.get(
        `/courses/chapters/${location.state?.chapterId}/assignments`
      );
      setAssignment(response.data[0]);
      fetchAssignmentFiles(response.data[0].AssignmentId);
      setAssignmentList(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchAssignmentFiles = async (assignmentId) => {
    try {
      const response = await axios.get(
        `/courses/chapters/${location.state?.chapterId}/assignmentfile/${assignmentId}`
      );
      setAttachFile(response.data);
    } catch (error) {
      console.error("Error fetching assignment files:", error);
    }
  };
  useEffect(() => {
    fetchAssignmentData();
  }, [location.state?.chapterId]);

  const handleNextAssignment = async (assignmentId) => {
    try {
      const chapterId = location.state?.chapterId;
      const response = await axios.get(
        `/courses/chapters/${chapterId}/assignments/${assignmentId}`
      );
      setAssignment(response.data);
      fetchAssignmentFiles(assignmentId);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="course-file-viewer gap-5 ">
      <div className="list-file">
        <List
          sx={{ width: "100%", maxWidth: 350, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          ref={listRef}
        >
          <ListItemButton component="div" id="nested-list-subheader">
            <Box
              sx={{
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                className="course-custom-icon"
                style={{ backgroundColor: "gray", color: "#fff" }}
              >
                <AssignmentOutlinedIcon />
              </div>
              <span onClick={handleToggle}>Upcoming</span>
            </Box>
            {open ? (
              <ExpandLessIcon onClick={handleToggle} />
            ) : (
              <ExpandMoreIcon onClick={handleToggle} />
            )}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {assignmentList.map((assignment, index) => (
              <ListItemText
                key={index}
                onClick={() => handleNextAssignment(assignment.AssignmentId)}
              >
                <div className="flex gap-3 items-center ml-10">
                  <AssessmentOutlinedIcon />
                  <ListItemText primary={assignment.AssignmentTitle} />
                </div>
              </ListItemText>
            ))}
          </Collapse>
        </List>
      </div>
      <div className="file-container outline-none  " tabIndex="0">
        <div className="assignment-body  bg-white h-full w-full rounded-lg">
          {assignment && (
            <>
              <div className="assignment-body-title">
                <h1 className="text-3xl	font-semibold		">
                  {assignment.AssignmentTitle}
                </h1>
                <p className="font-semibold	">Point: </p>
              </div>
              <div className="my-2">
                {assignment.StartDate ? (
                  <span>{formatDate(assignment?.StartDate)} - </span>
                ) : (
                  <span>
                    <em>None</em>
                  </span>
                )}

                {assignment.EndDate ? (
                  <span>{formatDate(assignment?.EndDate)}</span>
                ) : (
                  <span>
                    <em>None</em>
                  </span>
                )}
              </div>
              <div className="my-2">
                <p className="font-semibold	">Instructions:</p>
                {assignment.AssignmentDesc ? (
                  <span>{getText(assignment?.AssignmentDesc)}</span>
                ) : (
                  <span>
                    <em>None</em>
                  </span>
                )}
              </div>
              <div className="my-2">
                <p className="font-semibold	mb-2">Reference materials:</p>
                {attachFile.length > 0 ? (
                  <>
                    {attachFile.map((file, index) => (
                      <a
                        href={file.FileUrl}
                        download
                        style={{ textDecoration: "none" }}
                      >
                        <div key={index} className="drop-file-preview__item">
                          <img src={ImageConfig["default"]} alt="" />
                          <p>{file.FileTitle}</p>
                        </div>
                      </a>
                    ))}
                  </>
                ) : (
                  <span>
                    <em>None</em>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
