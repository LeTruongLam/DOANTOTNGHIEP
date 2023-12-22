import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./course.scss";
import { ImageConfig } from "../../config/ImageConfig.js";

import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListSubheader from "@mui/material/ListSubheader";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import AddLinkIcon from "@mui/icons-material/AddLink";
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
  const handleLogout = () => {
    navigate(location.state?.currentPath); // Redirect to "/" after logout
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
      // console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchAssignmentFiles = async (assignmentId) => {
    try {
      const response = await axios.get(
        `/courses/chapters/${location.state.chapterId}/assignmentfile/${assignmentId}`
      );
      setAttachFile(response.data);
    } catch (error) {
      console.error("Error fetching assignment files:", error);
    }
  };
  useEffect(() => {
    fetchAssignmentData();
  }, [location.state.chapterId]);

  const handleNextAssignment = async (assignmentId) => {
    try {
      const chapterId = location.state.chapterId;
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
    <div className="course-file-viewer">
      <div className="list-file">
        <List
          sx={{ width: "100%", maxWidth: 350, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          ref={listRef}
        >
          <ListSubheader component="div" id="nested-list-subheader">
            <Box
              sx={{
                fontWeight: "800",
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
              {open ? (
                <ExpandLessIcon onClick={handleToggle} />
              ) : (
                <ExpandMoreIcon onClick={handleToggle} />
              )}
            </Box>
          </ListSubheader>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {assignmentList.map((assignment, index) => (
              <ListItemButton
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                }}
                onClick={() => handleNextAssignment(assignment.AssignmentId)}
              >
                <AssessmentOutlinedIcon />
                <ListItemText primary={assignment.AssignmentTitle} />
              </ListItemButton>
            ))}
          </Collapse>
        </List>
        {/* <List
          sx={{ width: "100%", maxWidth: 350, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListSubheader component="div" id="nested-list-subheader">
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
                style={{ backgroundColor: "#FF0000", color: "#fff" }}
              >
                <AssignmentLateOutlinedIcon />
              </div>
              <span>Passdue</span>
            </Box>
          </ListSubheader>
          <ListItemButton
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <AssessmentOutlinedIcon />
            <ListItemText primary={"Hi"} />
          </ListItemButton>
          <ListItemButton
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <AssessmentOutlinedIcon />
            <ListItemText primary={"Hi"} />
          </ListItemButton>
        </List>
        <List
          sx={{ width: "100%", maxWidth: 350, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListSubheader component="div" id="nested-list-subheader">
            <Box
              sx={{
                fontWeight: "800",

                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                className="course-custom-icon"
                style={{ backgroundColor: "#57880d", color: "#fff" }}
              >
                <AssignmentTurnedInOutlinedIcon />
              </div>
              <span>Completed</span>
            </Box>
          </ListSubheader>
          <ListItemButton
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <AssessmentOutlinedIcon />
            <ListItemText primary={"Hi"} />
          </ListItemButton>
          <ListItemButton
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <AssessmentOutlinedIcon />
            <ListItemText primary={"Hi"} />
          </ListItemButton>{" "}
          <ListItemButton
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <AssessmentOutlinedIcon />
            <ListItemText primary={"Hi"} />
          </ListItemButton>{" "}
          <ListItemButton
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <AssessmentOutlinedIcon />
            <ListItemText primary={"Hi"} />
          </ListItemButton>
        </List> */}
      </div>
      <div className="file-container" tabIndex="0">
        <div className="navbar">
          <div className="navbar-container">
            <div className="links" onClick={handleLogout}>
              <ExitToAppIcon />
              <span>Exit</span>
            </div>
            <div className="turnin">
              <Button
                variant="contained"
                sx={{ color: "white", backgroundColor: "green" }}
              >
                Turn in
              </Button>
            </div>
          </div>
        </div>
        {assignment && (
          <div className="assignment-body">
            <div className="assignment-body-title">
              <h2>{assignment.AssignmentTitle}</h2>
              <p>Point: </p>
            </div>
            <div>
              {assignment.StartDate ? (
                <span>{assignment?.StartDate} - </span>
              ) : (
                <span>
                  <em>None</em>
                </span>
              )}

              {assignment.EndDate ? (
                <span>{assignment?.EndDate}</span>
              ) : (
                <span>
                  <em>None</em>
                </span>
              )}
            </div>
            <div>
              <p>
                <b>Instructions: </b>
              </p>
              {assignment.AssignmentDesc ? (
                <span>{assignment?.AssignmentDesc}</span>
              ) : (
                <span>
                  <em>None</em>
                </span>
              )}
            </div>
            <div>
              <p>
                <b>Reference materials: </b>
              </p>
              {attachFile.length > 0 ? (
                <>
                  {attachFile.map((file, index) => (
                    <a
                      href={file.FileUrl}
                      download
                      style={{textDecoration: "none"}}
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

            {/* <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <p>
                <b>My work: </b>
              </p>
              <AddLinkIcon />
            </div>
            <div style={{ maxWidth: "300px" }}>
              <div className="drop-file-preview__item">
                <p>LTL-20204996.docx</p>
              </div>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
