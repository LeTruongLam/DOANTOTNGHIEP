import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

export default function AddStudent({
  classCode,
  classId,
  courseId,
  isClose,
  fetchClassStudent,
}) {
  const [value, setValue] = useState([]);
  const [students, setStudents] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/students");
      setStudents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const studentList = value.map((student, index) => (
    <div key={index} className="bg-sub lesson-content">
      <div className="lesson-content-left">
        <DragIndicatorOutlinedIcon />
        {student.StudentName} - {student.StudentCode}
      </div>
    </div>
  ));

  const handleSaveClick = async () => {
    try {
      const studentIds = value.map((student) => student.StudentId);
      const response = await axios.post(`http://localhost:8800/api/classes/class/student`, {
        studentIds: studentIds,
        classId: classId,
        classCode: classCode,
        courseId: courseId,
      });

      if (response.status === 201) {
        setSuccessAlert(true);
        setMessage(response.data.message);
        isClose();
        fetchClassStudent(classCode);
      } else {
        setErrorAlert(true);
        setMessage(response.data.error || response.data.message);
      }
    } catch (error) {
      setErrorAlert(true);
      // setMessage("An error occurred while saving.");
    }
  };

  const hideAlerts = () => {
    setSuccessAlert(false);
    setErrorAlert(false);
    setMessage("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      hideAlerts();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [successAlert, errorAlert]);

  return (
    <>
      <div className="course-title">
        <div className="course-title-wrapper">
          <div className="course-title-header mt-3 mb-2">
            <p>Mã lớp học {classCode}</p>
          </div>
          <Autocomplete
            multiple
            id="fixed-tags-demo"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            options={students}
            getOptionLabel={(option) =>
              `${option.StudentName} - ${option.StudentCode}`
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Add student" />
            )}
          />
          <div className="course-title-body">
            <div className="grid mt-5">
              {studentList}
            </div>
          </div>
          <Button
            className="mt-3"
            variant="contained"
            onClick={handleSaveClick}
          >
            Save
          </Button>
        </div>
      </div>

      {successAlert && (
        <Alert severity="success" onClose={hideAlerts}>
          {message}
        </Alert>
      )}
      {errorAlert && (
        <Alert severity="error" onClose={hideAlerts}>
          {message}
        </Alert>
      )}
    </>
  );
}
