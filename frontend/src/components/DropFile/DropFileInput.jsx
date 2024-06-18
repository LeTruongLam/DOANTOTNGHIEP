import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./drop-file-input.css";
const DropFileInput = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const wrapperRef = useRef(null);
  const location = useLocation();
  useEffect(() => {}, []);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    setSelectedFile(newFile);
    props.onFileChange(newFile);
  };

  return (
    <div className="course-image">
      <div className="course-image-wrapper">
        <div className="course-image-header  mt-3 mb-3">
          <p>{props?.title}</p>
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
              <img src={`${location.state?.img}`} alt="" />
            </div>
          ) : (
            <div className="drop-file-input__label">
              <CloudUploadIcon fontSize="large" />
              <p>Kéo và thả tập tin của bạn vào đây</p>
            </div>
          )}
          <input type="file" value="" onChange={onFileDrop} />
        </div>
      </div>
      <div className="px-5 pb-3">
        <span className="text-slate-400	 italic">
          Kéo và thả tập tin của bạn vào đây
        </span>
      </div>
    </div>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
