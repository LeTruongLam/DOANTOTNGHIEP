import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { useLocation } from "react-router-dom";
import { formatDateString } from "../../../js/TAROHelper";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
        <Box sx={{ p: 2 }}>
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

const AssignmentView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = React.useState(0);
  const [assignments, setAssignments] = useState([]);

  const handleToAssignment = (assignment) => {
    console.table(assignment);
    navigate(`/assignments/${location.state.courseTitle}/classroom`, {
      state: {
        assignment: assignment,
        assignmentId: assignment.AssignmentId,
        courseId: location.state?.courseId,
      },
    });
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `/courses/${location.state?.courseId}/assignments`
      );
      setAssignments(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchAssignments();
    // const fetchAssignmentSubmissons = async () => {
    //   try {
    //     const res = await axios.get(`/courses/assignments/submission`);
    //     setAssignments(res.data);
    //     console.table(res.data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // fetchAssignmentSubmissons();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box>
          <div className="flex justify-between items-center">
            <Tabs value={value} onChange={handleChange}>
              <Tab
                label="Upcoming"
                {...a11yProps(0)}
                sx={{ textTransform: "none" }}
              />
              <Tab
                label="Pass due"
                {...a11yProps(1)}
                sx={{ textTransform: "none" }}
              />
            </Tabs>
          </div>
        </Box>
        <CustomTabPanel value={value} index={0}></CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ul role="list" className="divide-y divide-slate-200 mt-3">
            {assignments.map((assignment) => (
              <li
                onClick={() => handleToAssignment(assignment)}
                key={assignment.AssignmentId}
                className=" border border-gray-50 rounded-lg shadow mb-4"
              >
                <div className="px-4 flex justify-between gap-x-6 py-5 hover:text-indigo-500  hover:bg-slate-50	hover:cursor-pointer">
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {assignment.AssignmentTitle}
                      </p>
                      <p className="mt-1 truncate text-sm leading-5 text-gray-500">
                        Deadline is {formatDateString(assignment.EndDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-items-center items-center pr-4 gap-4">
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className=" font-semibold	 text-sm leading-6 text-gray-900">
                        {assignment.title}
                      </p>
                      <p className="text-sm italic leading-6 text-gray-900">
                        {assignment.CourseCode}/ {assignment.ChapterTitle}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CustomTabPanel>
      </Box>
    </>
  );
};

export default AssignmentView;
