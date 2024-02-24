import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
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

const TheAssignment = () => {
  const navigate = useNavigate();

  const [value, setValue] = React.useState(0);
  const [assignments, setAssignments] = useState([]);

  const handleToAssignment = (assignment) => {
    navigate(`/assignmentDetail/${assignment.SubmissionId}`, {
      state: { assignment: assignment },
    });
  };
  useEffect(() => {
    const fetchAssignmentSubmissons = async () => {
      try {
        const res = await axios.get(`/courses/assignments/submission`);
        setAssignments(res.data);
        console.table(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAssignmentSubmissons();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
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
              <Tab
                label="Completed"
                {...a11yProps(2)}
                sx={{ textTransform: "none" }}
              />
            </Tabs>
            <FilterAltOutlinedIcon />
          </div>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <ul role="list" className="divide-y divide-slate-200 mt-3">
            {assignments.map((assignment) => (
              <li key={assignment.SubmissionId}>
                <div
                  onClick={() => handleToAssignment(assignment)}
                  className="flex justify-between gap-x-6 py-5 hover:text-indigo-500  hover:bg-slate-50	hover:cursor-pointer"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <img
                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {assignment.StudentName}
                      </p>
                      <p className="mt-1 truncate text-sm leading-5 text-gray-500">
                        {assignment.StudentCode}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className=" font-semibold	 text-sm leading-6 text-gray-900">
                      {assignment.title} / {assignment.ChapterTitle}
                    </p>
                    <p className="text-sm italic leading-6 text-gray-900">
                      {assignment.AssignmentTitle} / Submitted at{" "}
                      {assignment.SubmissionDate}
                    </p>

                    {/* {assignment.lastSeen ? (
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      <time dateTime={assignment.lastSeenDateTime}>
                        {assignment.lastSeen}
                      </time>
                    </p>
                  ) : (
                    <div className="mt-1 flex items-center gap-x-1.5">
                      <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-xs leading-5 text-gray-500">Online</p>
                    </div>
                  )} */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {assignments}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>
    </>
  );
};

export default TheAssignment;
