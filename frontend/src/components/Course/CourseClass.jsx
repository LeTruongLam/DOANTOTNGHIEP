import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import { Button, message } from "antd";
import * as XLSX from "xlsx";

export default function CourseClass({ courseId, title, subTitle }) {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classCode, setClassCode] = useState("");
  // import file excel
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      console.log(parsedData);
      setData(parsedData);
    };
  };
  const handleImportFile = async (classId) => {
    try {
      const res = await axios.post(
        `http://localhost:8800/api/classes/${classId}/importExcel`,
        { studentDatas: data }
      );
      message.success("Thêm sinh viên thành công");
    } catch (error) {
      console.error(error);
    }
  };
  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/classes/${courseId}`
      );
      setClasses(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, []);
  const handleDeleteClass = async (classId) => {
    try {
      await axios.delete(`http://localhost:8800/api/classes/${classId}`);
      message.success("Xóa thành công");
      fetchClasses();
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };
  const classItems = classes.map((classItem) => (
    <div className="bg-sub lesson-content" key={classItem.ClassId}>
      <div className="lesson-content-left">
        <ClassOutlinedIcon />
        {classItem.ClassCode}
      </div>
      <div className="flex gap-3 justify-center items-center">
        <div
          className=" text-gray-900
             px-2 py-2 text-base flex gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <div className="cursor-pointer relative w-6 h-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            className="cursor-pointer  w-6 h-6"
            viewBox="0 0 24 24"
            onClick={() => document.getElementById("fileInput").click()} // Trigger file input click
          >
            <path d="M 14 3 L 2 5 L 2 19 L 14 21 L 14 19 L 21 19 C 21.552 19 22 18.552 22 18 L 22 6 C 22 5.448 21.552 5 21 5 L 14 5 L 14 3 z M 12 5.3613281 L 12 18.638672 L 4 17.306641 L 4 6.6933594 L 12 5.3613281 z M 14 7 L 16 7 L 16 9 L 14 9 L 14 7 z M 18 7 L 20 7 L 20 9 L 18 9 L 18 7 z M 5.1757812 8.296875 L 7.0605469 11.994141 L 5 15.703125 L 6.7363281 15.703125 L 7.859375 13.308594 C 7.934375 13.079594 7.9847656 12.908922 8.0097656 12.794922 L 8.0253906 12.794922 C 8.0663906 13.032922 8.1162031 13.202109 8.1582031 13.287109 L 9.2714844 15.701172 L 11 15.701172 L 9.0058594 11.966797 L 10.943359 8.296875 L 9.3222656 8.296875 L 8.2929688 10.494141 C 8.1929688 10.779141 8.1257969 10.998625 8.0917969 11.140625 L 8.0664062 11.140625 C 8.0084063 10.902625 7.9509531 10.692719 7.8769531 10.511719 L 6.953125 8.296875 L 5.1757812 8.296875 z M 14 11 L 16 11 L 16 13 L 14 13 L 14 11 z M 18 11 L 20 11 L 20 13 L 18 13 L 18 11 z M 14 15 L 16 15 L 16 17 L 14 17 L 14 15 z M 18 15 L 20 15 L 20 17 L 18 17 L 18 15 z"></path>
          </svg>
          <input
            type="file"
            accept=".xlsx, .xls"
            id="fileInput"
            className="absolute top-0 left-0 opacity-0 w-6 h-6 cursor-pointer"
            onChange={handleFileUpload}
          />
        </div>
        {data && data.length > 0 ? (
          <div className="text-gray-700 px-2 py-2 text-base flex gap-2">
            <Button
              onClick={() => {
                handleImportFile(classItem.ClassId);
              }}
              type="primary"
            >
              Lưu
            </Button>
          </div>
        ) : (
          // Nội dung khi không có dữ liệu (ví dụ: nút xóa lớp học)
          <div
            className="text-gray-700 px-2 py-2 text-base flex gap-2 cursor-pointer"
            onClick={() => {
              handleDeleteClass(classItem.ClassId);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z"></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  ));

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await axios.post(`http://localhost:8800/api/classes/${courseId}`, {
        classCode: classCode,
        teacherId: location.state.TeacherId,
      });
      message.success("Tạo thành công");
    } catch (error) {
      console.log(error);
    }
    fetchClasses();
    setIsEditing(false);
  };

  return (
    <div className="course-title overflow-visible	py-0.5">
      <div className="course-title-wrapper">
        <div className="course-title-header   mt-3 mb-3">
          <p>{title}</p>
          {!isEditing ? (
            <div
              onClick={handleIconClick}
              className="course-title-action items-center	"
            >
              <AddCircleOutlineOutlinedIcon fontSize="small" />
              <span>{subTitle}</span>
            </div>
          ) : (
            <div onClick={handleCancelClick} className="course-title-action">
              <span>Hủy</span>
            </div>
          )}
        </div>
        <div>
          {!isEditing ? (
            <>
              {classes[0] ? (
                <>{classItems}</>
              ) : (
                <div className=" text-slate-400	 italic">Không có lớp học </div>
              )}
            </>
          ) : (
            <div className="grid">
              <TextField
                className="bg-main"
                onChange={(e) => setClassCode(e.target.value)}
              />
              <button
                className="text-white border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
                onClick={handleSaveClick}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
