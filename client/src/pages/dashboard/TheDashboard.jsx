import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { formatDate, getText } from "../../js/TAROHelper";
import axios from "axios";
const columns = [
  { id: "title", label: "Title", minWidth: 170 },
  { id: "code", label: "Code", minWidth: 100 },
  {
    id: "start",
    label: "Start Date",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "end",
    label: "End Date",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "options",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

function createData(title, code, start, end, options) {
  return { title, code, start, end, options };
}

export default function StickyHeadTable() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const cat = useLocation().search;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleEdit = async (courseId, course) => {
    navigate(`/write?edit=${courseId}`, { state: course });
  };

  const rows = courses.map((course) =>
    createData(
      getText(course.title),
      course.CourseCode,
      formatDate(course.StartDate),
      formatDate(course.EndDate),
      <Chip
        onClick={() => handleEdit(course.CourseId, course)} // Sử dụng hàm mô phỏng để truyền tham số
        label="Edit"
        sx={{ color: "white", backgroundColor: "black", fontWeight: "600" }}
        size="small"
      />
    )
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/courses/${cat}`);
        setCourses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [cat]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleWrite = () => {
    navigate("/course/create");
  };
  const handleExit = () => {
    navigate("/course");
  };

  return (
      <div className="grow-[3]">
        <div>
          <div className="my-6 flex justify-between">
            <input
              type="text"
              name="search-course"
              id="search-course"
              autoComplete="given-name"
              placeholder="Search course"
              className=" outline-none block w-80 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
            />
            <button
              onClick={handleWrite}
              type="submit"
              className="flex-none rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <AddCircleOutlineIcon className="mr-1" />
              New Course
            </button>
          </div>
        </div>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ height: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
      </div>
  );
}
