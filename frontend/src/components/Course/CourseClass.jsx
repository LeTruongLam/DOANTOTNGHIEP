import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import { Button, message } from "antd";
import * as XLSX from "xlsx";
import { CloudUpload, Plus, Trash2 } from "lucide-react";

export default function CourseClass({ courseId, title, subTitle }) {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classCode, setClassCode] = useState("");
  const [data, setData] = useState([]);
  const [currentClassId, setCurrentClassId] = useState(null);
  const [editClassId, setEditClassId] = useState(null);
  const navigate = useNavigate();
  const handleFileUpload = (e, classId) => {
    setCurrentClassId(classId);
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  };

  const handleImportFile = async (classId) => {
    try {
      await axios.post(
        `http://localhost:8800/api/classes/${classId}/importExcel`,
        { studentDatas: data }
      );
      message.success("Thêm sinh viên thành công");
      setData([]); // Clear the data after successful import
      setCurrentClassId(null); // Reset the current class ID
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

  const handleAddClick = (classId) => {
    setEditClassId(classId);
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:8800/api/classes/${courseId}`,
        {
          classCode: classCode, // Include classCode in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      message.success("Tạo thành công");
      fetchClasses();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
    fetchClasses();
    setEditClassId(null);
  };

  const handleCancelClick = () => {
    setEditClassId(null);
  };

  const classItems = classes.map((classItem) => (
    <div key={classItem.ClassId}>
      <div className="bg-sub lesson-content">
        <div className="lesson-content-left">
          <ClassOutlinedIcon />
          {classItem.ClassCode}
        </div>
        <div className="flex gap-5 justify-center items-center">
          <div className="flex gap-1 justify-center items-center">
            <div className=" text-gray-900 px-2 py-2 text-base flex gap-2">
              <Plus onClick={() => handleAddClick(classItem.ClassId)} />
            </div>
            <div className="cursor-pointer relative w-6 h-6">
              <CloudUpload />
              <input
                type="file"
                accept=".xlsx, .xls"
                id="fileInput"
                className="absolute top-0 left-0 opacity-0 w-6 h-6 cursor-pointer"
                onChange={(e) => handleFileUpload(e, classItem.ClassId)}
              />
            </div>
            {currentClassId === classItem.ClassId && data && data.length > 0 ? (
              <div className="text-gray-700 px-2 py-2 text-base flex gap-2">
                <Button
                  onClick={() => handleImportFile(classItem.ClassId)}
                  type="primary"
                >
                  Lưu
                </Button>
              </div>
            ) : (
              <div
                className="text-gray-700 px-2 py-2 text-base flex gap-2 cursor-pointer"
                onClick={() => handleDeleteClass(classItem.ClassId)}
              >
                <Trash2 />
              </div>
            )}
          </div>
          <div>
            <Button
              onClick={() => {
                navigate(
                  `/teacher/courses/${courseId}/classes/${classItem.ClassId}`
                );
              }}
              type="primary"
            >
              Xem danh sách lớp
            </Button>
          </div>
        </div>
      </div>
      {editClassId === classItem.ClassId && (
        <div className="grid mt-2">
          <TextField
            className="bg-main"
            onChange={(e) => setClassCode(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              className="text-white border-none bg-gray-800 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
              onClick={handleCancelClick}
            >
              Hủy
            </button>
            <button
              className="text-white border-none bg-gray-800 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
              onClick={handleSaveClick}
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  ));

  return (
    <div className="course-title overflow-visible py-0.5">
      <div className="course-title-wrapper">
        <div className="course-title-header mt-3 mb-3">
          <p>{title}</p>
          {!isEditing ? (
            <div
              onClick={() => setIsEditing(true)}
              className="course-title-action items-center"
            >
              <AddCircleOutlineOutlinedIcon fontSize="small" />
              <span>{subTitle}</span>
            </div>
          ) : (
            <div
              onClick={() => setIsEditing(false)}
              className="course-title-action"
            >
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
                <div className="text-slate-400 italic">Không có lớp học</div>
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
