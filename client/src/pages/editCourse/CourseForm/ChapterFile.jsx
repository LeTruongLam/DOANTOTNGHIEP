import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "../EditWrite.scss";
import { ImageConfig } from "../../../config/ImageConfig";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import "../../../components/drop-file-input/drop-file-input.css";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

const ChapterFile = ({ chapterId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [docs, setDocs] = useState([]);
  const [datas, setData] = useState([]);
  const fetchCourseFiles = async () => {
    try {
      const response = await axios.get(
        `/courses/chapters/document/${chapterId}`
      );
      setData(response.data);
      const documentUrls = response.data.map((item) => item.DocumentUrl);
      console.log(response.data);
      const documents = documentUrls.map((url) => ({ uri: url }));
      setDocs(documents);
    } catch (error) {
      console.error("Error fetching course files:", error);
    }
  };

  useEffect(() => {
    fetchCourseFiles();
  }, []);

  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      formData.append("document", selectedFile);
      console.log(selectedFile);
      const response = await axios.post(
        `/users/uploadDocument/${chapterId}`,
        formData
      );
      setSelectedFile(response.data);
      fetchCourseFiles();
      setFileList([]);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setSelectedFile(newFile);
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      console.log("file: " + newFile);
    }
  };
  const handleDeleteFile = async (documentId) => {
    try {
      await axios.delete(
        `/courses/chapters/${chapterId}/document/${documentId}`
      );
      alert("Xóa thành công");
      fetchCourseFiles();
    } catch (error) {
      console.error("Lỗi xóa tệp tin:", error);
    }
  };

  const fileRemove = (file) => {
    const updatedList = fileList.filter((item) => item !== file);
    setFileList(updatedList);
  };

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="course-image">
      <div className="course-image-wrapper">
        <div className="course-image-header">
          <p>Resources & Attachments</p>
          <div
            onClick={handleIconClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <ControlPointIcon fontSize="small" />
            <span>Add a file</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={onFileDrop}
          />
        </div>
        {datas.length > 0 && (
          <>
            <p>
              <b>Attached: </b>
            </p>

            {datas.map((data, index) => (
              <div key={index} className="drop-file-preview__item">
                <img src={ImageConfig["default"]} alt="" />
                <p>{data.DocumentName}</p>
                <span className="drop-file-preview__item__del">
                  <CloseIcon
                    onClick={() => {
                      handleDeleteFile(data.DocumentId);
                    }}
                    fontSize="small"
                  />
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {fileList.length > 0 && (
        <div className="drop-file-preview">
          <p>
            <b>Attaching: </b>
          </p>

          {fileList.map((item, index) => (
            <div key={index} className="drop-file-preview__item">
              <img
                src={
                  ImageConfig[item.type.split("/")[1]] || ImageConfig["default"]
                }
                alt=""
              />
              <p>{item.name}</p>
              <span
                className="drop-file-preview__item__del"
                onClick={() => fileRemove(item)}
              >
                <CloseIcon fontSize="small" />
              </span>
            </div>
          ))}

          <Button
            style={{
              marginTop: "12px",
              width: "max-content",
            }}
            variant="contained"
            onClick={handleSaveClick}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChapterFile;
