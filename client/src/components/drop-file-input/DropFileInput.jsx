import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

import "./drop-file-input.css";
import EditIcon from "@mui/icons-material/Edit";
import { ImageConfig } from "../../config/ImageConfig";
import uploadImg from "../../img/cloud-upload-regular-240.png";
import Typography from "@mui/material/Typography";
const DropFileInput = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const wrapperRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    console.log(location.state.img);
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

  //   const fileRemove = (file) => {
  //     const updatedList = [...fileList];
  //     updatedList.splice(fileList.indexOf(file), 1);
  //     setFileList(updatedList);
  //     props.onFileChange(updatedList);
  //   };

  return (
    <div className="course-image">
      <div className="course-image-wrapper">
        <div className="course-image-header">
          <p>Course Image</p>
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
          ) : location.state && location.state.img ? (
            <div className="selected-file">
              <img src={`../upload/${location.state.img}`} alt="" />
            </div>
          ) : (
            <div className="drop-file-input__label">
              <img src={uploadImg} alt="" />
              <p>Drag & Drop your files here</p>
            </div>
          )}
          <input type="file" value="" onChange={onFileDrop} />
        </div>
      </div>

      {/* {fileList.length > 0 ? (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">Ready to upload</p>
          {fileList.map((item, index) => (
            <div key={index} className="drop-file-preview__item">
              <img
                src={
                  ImageConfig[item.type.split("/")[1]] || ImageConfig["default"]
                }
                alt=""
              />
              <div className="drop-file-preview__item__info">
                <p>{item.name}</p>
                <p>{item.size}B</p>
              </div>
              <span
                className="drop-file-preview__item__del"
                onClick={() => fileRemove(item)}
              >
                x
              </span>
            </div>
          ))}
        </div>
      ) : null} */}
    </div>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
