import React, { useEffect, Fragment, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { formatDateString } from "@/js/TAROHelper";
import axios from "axios";
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
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const columns = [
  { id: "title", label: "Tên sinh viên", minWidth: 250 },
  {
    id: "start",
    label: "Trạng thái",
    minWidth: 300,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },

  {
    id: "options",
    label: "Điểm",
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

const AssignmentClassPage = () => {
  const [selected, setSelected] = useState();
  const { assignmentId, courseId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [classes, setClasses] = useState([]);
  const [assignment, setAssignment] = useState();
  const [classId, setClassId] = useState();
  const [classCode, setClassCode] = useState("");
  const [classStudent, setClassStudent] = useState([]);
  const [gradedStudents, setGradedStudents] = useState([]);
  const [ungradedStudents, setUngradedStudents] = useState([]);

  useEffect(() => {
    fetchClassesOfCourse();
    fetchAssignment();
  }, []);
  // Lấy danh sách lớp của môn học
  const fetchClassesOfCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/classes/${courseId}`
      );
      setClasses(res.data);
      setClassCode(res.data[0]?.ClassCode);
      setSelected(res.data[0]?.ClassCode);
      fetchStudentAndAssignmentStatus(res.data[0]?.ClassId);
    } catch (error) {
      console.error(error);
    }
  };
  // Lấy thông tin của assignment
  const fetchAssignment = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/assignments/${assignmentId}`
      );
      setAssignment(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchStudentAndAssignmentStatus = async (classId) => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/assignments/${assignmentId}/classroom/${classId}`
      );
      const students = res.data;
      const graded = students.filter((student) => student.Graded === 1);
      const ungraded = students.filter((student) => student.Graded !== 1);
      setClassStudent(students);
      setGradedStudents(graded);
      setUngradedStudents(ungraded);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToAssignmentDetail = async (student) => {
    if (student.SubmissionId) {
      navigate(
        `/teacher/courses/${courseId}/assignments/${assignmentId}/assignment-detail/${student?.SubmissionId}`,
        {
          state: {
            classStudent: classStudent,
          },
        }
      );
    } else {
      try {
        const res = await axios.post(
          `http://localhost:8800/api/courses/chapters/${assignment.ChapterId}/submission/teacherAdd`,
          {
            assignmentId: assignmentId,
            chapterId: assignment.ChapterId,
            userId: student.UserId,
            courseId: courseId,
          }
        );
        let newSubmissionId = res.data.data;
        navigate(
          `/teacher/courses/${courseId}/assignments/${assignmentId}/assignment-detail/${newSubmissionId}`,
          {
            state: {
              classStudent: classStudent,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const createRows = (students) => {
    return students?.map((student, index) => {
      return createData(
        `${student?.StudentName}  ${student?.StudentCode}`,
        student.Status === 1 ? (
          <div className="flex justify-start items-center gap-2">
            <CheckIcon color="primary" />
            <span className="text-blue-800">
              Đã nộp lúc {formatDateString(student?.SubmissionDate)}
            </span>
          </div>
        ) : (
          <div className="flex justify-start items-center gap-2">
            <BlockIcon color="error" />
            <span className="text-red-800">Chưa nộp bài</span>
          </div>
        ),
        <div className="rounded-md opacity-50 bg-gray-50 py-2.5 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          {student?.Score} / 10
        </div>,
        <button
          onClick={() => handleToAssignmentDetail(student)}
          className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
        >
          Xem chi tiết
        </button>
      );
    });
  };
  const rowsUngraded = createRows(ungradedStudents);
  const rowsGraded = createRows(gradedStudents);
  const [value, setValue] = useState(0);
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
    <div className="px-5">
      <div className="py-4 border-b flex justify-between border-slate-300">
        <div>
          <h1 className="font-semibold text-3xl	mb-1 ">
            {assignment?.AssignmentTitle}
          </h1>
          <span className="text-lg">
            <span className=" text-red-700 font-bold"> Đến hạn lúc </span>
            <span className=" opacity-70">
              {formatDateString(assignment?.EndDate)}
            </span>
          </span>
        </div>
      </div>
      <div className="mb-5">
        <Box sx={{ width: "100%" }}>
          <Box>
            <div className="flex justify-between ">
              <div className="flex justify-between items-center ">
                <Tabs value={value} onChange={handleChange}>
                  <Tab
                    className="border-none outline-none focus:outline-none focus-visible:outline-none"
                    label={
                      <span style={{ fontWeight: "bold" }}>
                        Đang trả bài ({ungradedStudents?.length})
                      </span>
                    }
                    {...a11yProps(0)}
                    sx={{ textTransform: "none" }}
                  />
                  <Tab
                    className="border-none outline-none focus:outline-none focus-visible:outline-none"
                    label={
                      <span style={{ fontWeight: "bold" }}>
                        Đã trả bài ({gradedStudents?.length})
                      </span>
                    }
                    {...a11yProps(1)}
                    sx={{ textTransform: "none" }}
                  />
                </Tabs>
              </div>
              <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                  <div className="relative mt-2">
                    <Listbox.Button className="relative w-full min-w-80 cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                      <span className="flex items-center">
                        <span className="ml-3 block truncate">
                          {selected} - {assignment?.CourseTitle}
                        </span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {classes.map((classItem, index) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={classItem.ClassCode}
                            onClick={() => {
                              setSelected(classItem?.ClassCode);
                              setClassId(classItem.ClassId);
                              fetchStudentAndAssignmentStatus(
                                classItem.ClassId
                              );
                            }}
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="flex items-center">
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "ml-3 block truncate"
                                    )}
                                  >
                                    {classItem?.ClassCode} - {classItem?.title}
                                  </span>
                                </div>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-indigo-600",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            </div>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Paper sx={{ width: "100%", overflow: "hidden", marginTop: 1 }}>
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
                    {rowsUngraded
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
                count={rowsUngraded.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Paper sx={{ width: "100%", overflow: "hidden", marginTop: 1 }}>
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
                    {rowsGraded
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
                count={rowsGraded.length}
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

export default AssignmentClassPage;
