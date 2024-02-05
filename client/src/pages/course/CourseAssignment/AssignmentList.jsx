import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../course.scss";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatDate, getText } from "../../../js/TAROHelper";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Box from "@mui/material/Box";
import { PaperClipIcon } from "@heroicons/react/20/solid";
const AssignmentList = () => {
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
    <div>AssignmentList</div>
  )
}

export default AssignmentList