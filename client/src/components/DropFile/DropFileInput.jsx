import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import "./drop-file-input.css";
import EditIcon from "@mui/icons-material/Edit";
import uploadImg from "../../img/cloud-upload-regular-240.png";
const DropFileInput = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const wrapperRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    console.log(location.state?.img);
  }, []);
  const [fileList, setFileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setSelectedFile(newFile);
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
      console.log("file: " + newFile);
    }
  };

  return (
    <div className="course-image">
      <div className="course-image-wrapper">
        <div className="course-image-header  mt-3 mb-3">
          <p>{props.title}</p>
          <p>
            <EditIcon fontSize="small" onClick={() => setSelectedFile(null)} />
          </p>
        </div>
        <div
          ref={wrapperRef}
          className="drop-file-input"
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {selectedFile ? (
            <div className="selected-file">
              <img src={URL.createObjectURL(selectedFile)} alt="" />
            </div>
          ) : location.state && location.state?.img ? (
            <div className="selected-file">
              <img src={`../upload/${location.state?.img}`} alt="" />
            </div>
          ) : (
            <div className="drop-file-input__label">
              <CloudUploadIcon fontSize="large"/>
              <p>Drag & Drop your file here</p>
            </div>
          )}
          <input type="file" value="" onChange={onFileDrop} />
        </div>
      </div>
    </div>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
