import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import "@/components/DropFile/drop-file-input.css";
import CloseIcon from "@mui/icons-material/Close";
import { message } from "antd";

const AssignmentFile = ({ chapterId, assignmentId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAssignmentFiles();
  }, []);

  const fetchAssignmentFiles = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignmentfile/${assignmentId}`
      );
      setFiles(data);
    } catch (error) {
      console.error("Error fetching course files:", error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      formData.append("document", selectedFile);
      const { data } = await axios.post(
        `http://localhost:8800/api/users/chapters/uploadAssignmentFile/${assignmentId}`,
        formData
      );
      setSelectedFile(data);
      message.success("Đính kèm thành công!");

      fetchAssignmentFiles();
      setFileList([]);
      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setSelectedFile(newFile);
      setFileList([...fileList, newFile]);
    }
  };

  const handleDeleteFile = async (documentId) => {
    try {
      await axios.delete(
        `http://localhost:8800/api/courses/assignments/${assignmentId}/assignmentFile/${documentId}`
      );
      message.success("Xóa thành công!");
      fetchAssignmentFiles();
    } catch (error) {
      console.error("Lỗi xóa tệp tin:", error);
    }
  };

  const fileRemove = (file) => {
    setFileList(fileList.filter((item) => item !== file));
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="course-image">
      <div className="course-image-wrapper">
        <div className="course-image-header  mt-3 mb-3">
          <p>Tài nguyên & Tệp đính kèm</p>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleIconClick}
          >
            <ControlPointIcon fontSize="small" />
            <span>Thêm tập tin</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={onFileDrop}
          />
        </div>
        {files.length > 0 && (
          <>
            <p>
              <b>Đã đính kèm: </b>
            </p>
            {files.map((file) => (
              <div
                key={file.AssignmentFileId}
                className="drop-file-preview__item"
              >
                <p>{file.FileTitle}</p>
                <span className="drop-file-preview__item__del">
                  <CloseIcon
                    onClick={() => handleDeleteFile(file.AssignmentFileId)}
                    fontSize="small"
                  />
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {fileList.length > 0 && (
        <div className="drop-file-preview ">
          <p className=" mt-3 mb-3 font-bold">Đính kèm:</p>
          {fileList.map((file, index) => (
            <div key={index} className="drop-file-preview__item">
              <p>{file.name}</p>
              <span
                className="drop-file-preview__item__del"
                onClick={() => fileRemove(file)}
              >
                <CloseIcon fontSize="small" />
              </span>
            </div>
          ))}
          <button
            className="text-white  border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
            onClick={handleSaveClick}
          >
            Lưu
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentFile;
