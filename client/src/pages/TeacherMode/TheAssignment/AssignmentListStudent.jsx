import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { formatDateString } from "../../../js/TAROHelper";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
const columns = [
  { id: "title", label: "Name", minWidth: 250 },
  {
    id: "start",
    label: "Status",
    minWidth: 300,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },

  {
    id: "options",
    label: "Points",
    minWidth: 60,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "views",
    minWidth: 40,

    align: "right",
    format: (value) => value.toFixed(2),
  },
];
function createData(title, start, options, views) {
  return { title, start, options, views };
}

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

const AssignmentListStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState();
  const [classCode, setClassCode] = useState("");
  const [classStudent, setClassStudent] = useState([]);
  useEffect(() => {
    fetchClassesOfCourse();
  }, []);
  // Lấy danh sách lớp của môn học
  const fetchClassesOfCourse = async () => {
    try {
      const res = await axios.get(`/classes/${location.state?.courseId}`);
      setClasses(res.data);
      setClassCode(res.data[0]?.ClassCode);
      fetchStudentAndAssignmentStatus(res.data[0]?.ClassId);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudentAndAssignmentStatus = async (classId) => {
    try {
      const res = await axios.get(
        `/courses/assignments/${location.state?.assignmentId}/classroom/${classId}`
      );
      setClassStudent(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleToAssignmentDetail = (student) => {
    console.log(student);
    navigate(
      `/Assignment-Detail/${student?.SubmissionId}`,
      {
        state: {
          assignmentId: location.state?.assignmentId,
          student: student,
          userId: student.UserId,
          classStudent: classStudent,
        },
      }
    );
  };
  const handleChangeClass = (event) => {
    setClassCode(event.target.value);
  };
  const rows = classStudent?.map((student, index) => {
    return createData(
      `${student?.StudentName}  ${student?.StudentCode}`,
      student.Status === 1 ? (
        <div className="flex justify-start items-center gap-2">
          <CheckIcon color="primary" />
          <span className="text-blue-800">
            Turned in {formatDateString(student?.SubmissionDate)}
          </span>
        </div>
      ) : (
        <div className="flex justify-start items-center gap-2">
          <BlockIcon color="error" />
          <span className="text-red-800">Not turned in</span>
        </div>
      ),
      <div className="rounded-md opacity-50 bg-gray-50 py-2.5 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {student?.Score} / 10
      </div>,
      <button
        onClick={() => handleToAssignmentDetail(student)} // Sử dụng hàm mô phỏng để truyền tham số
        className="font-medium text-indigo-600 hover:text-indigo-500"
      >
        View
      </button>
    );
  });
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <div>
      <div className="py-4 border-b flex justify-between border-slate-300">
        <div>
          <h1 className="font-semibold text-2xl	 ">
            {location.state.assignment?.AssignmentTitle}
          </h1>
          <span className="opacity-70">
            {"Due in "}
            {formatDateString(location.state.assignment?.EndDate)}
          </span>
        </div>
        <input
          type="text"
          name="search-course"
          id="search-course"
          autoComplete="given-name"
          placeholder="Search students"
          className=" outline-none block w-80 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        />
      </div>
      <div className="mb-5">
        <Box sx={{ width: "100%" }}>
          <Box>
            <div className="flex justify-between ">
              <div className="flex justify-between items-center ">
                <Tabs value={value} onChange={handleChange}>
                  <Tab
                    label={
                      <span style={{ fontWeight: "bold" }}>To return (30)</span>
                    }
                    {...a11yProps(0)}
                    sx={{ textTransform: "none" }}
                  />
                  <Tab
                    label={<span style={{ fontWeight: "bold" }}>Returned</span>}
                    {...a11yProps(1)}
                    sx={{ textTransform: "none" }}
                  />
                </Tabs>
              </div>
              <FormControl
                sx={{ m: 1, backgroundColor: "#fff", minWidth: 300 }}
                size="medium"
              >
                <InputLabel id="demo-select-small-label">Class Code</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={classCode || ""}
                  label="Class Code"
                  onChange={handleChangeClass}
                >
                  {classes.map((classItem, classIndex) => (
                    <MenuItem
                      key={classIndex}
                      value={classItem.ClassCode}
                      onClick={() => {
                        setClassCode(classItem.ClassCode);

                        setClassId(classItem.ClassId);
                        fetchStudentAndAssignmentStatus(classItem.ClassId);
                      }}
                    >
                      {classItem.ClassCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ height: "100%", minHeight: 450 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                            fontWeight: "bold",
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  );
};

export default AssignmentListStudent;
