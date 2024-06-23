import React, { useState, useEffect, useContext } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AuthContext } from "@/context/authContext";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
export default function ClassList({ courseId, classCodeStudent }) {
  const { currentUser } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [classCode, setClassCode] = useState("");
  const [classId, setClassId] = useState("");
  const [classStudent, setClassStudent] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);

  const fetchClasses = async () => {
    try {
      let res;
      if (currentUser.Role === "teacher") {
        res = await axios.get(`http://localhost:8800/api/classes/${courseId}`);
        setClasses(res.data);
        setIsTeacher(true);
      } else if (currentUser.Role === "student") {
        res = await axios.get(
          `http://localhost:8800/api/classes/${courseId}/class/${classCodeStudent}`
        );
        setClassStudent(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchClassStudent = async (classCode) => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/classes/${courseId}/class/${classCode}`
      );
      setClassStudent(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, []);
  const handleChange = (event) => {
    setClassCode(event.target.value);
    console.log(event.target.value);
    fetchClassStudent(event.target.value);
  };

  return (
    <div className="rounded-b-lg" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="p-5">
        {isTeacher && (
          <FormControl
            fullWidth
            sx={{ m: 1, backgroundColor: "#fff" }}
            size="medium"
          >
            <InputLabel id="demo-select-small-label">Class Code</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={classCode}
              label="Class Code"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {classes.map((classItem, classIndexs) => (
                <MenuItem
                  key={classIndexs}
                  value={classItem.ClassCode}
                  onClick={() => setClassId(classItem.ClassId)}
                >
                  {classItem.ClassCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <div className="class-container bg-white">
          <div className="class-wrapper">
            <div className="class-title">
              Mã lớp học : {classCode || classCodeStudent}
            </div>
            <div className="class-header font-bold mt-3">
              <p>Danh sách lớp ({classStudent.length})</p>
            </div>

            {classStudent.map((student, index) => (
              <div className="student-info mt-3" key={index}>
                <div>
                  <Avatar alt="Cindy Baker" />
                </div>
                <div>
                  <p>
                    <b>{student.StudentName}</b>
                  </p>
                  <p>{student.StudentCode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
