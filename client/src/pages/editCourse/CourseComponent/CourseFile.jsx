import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { ImageConfig } from "../../../config/ImageConfig";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import "../../../components/drop-file-input/drop-file-input.css";
import CloseIcon from "@mui/icons-material/Close";

const CourseFile = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await axios.post("/upload/24", formData);
      setSelectedFile(response.data);
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
      </div>

      {fileList.length > 0 && (
        <div className="drop-file-preview">
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
        </div>
      )}

      {fileList.length > 0 && (
        <button className="send-button" onClick={upload}>
          Send
        </button>
      )}
    </div>
  );
};

CourseFile.propTypes = {
  onFileChange: PropTypes.func,
};

export default CourseFile;