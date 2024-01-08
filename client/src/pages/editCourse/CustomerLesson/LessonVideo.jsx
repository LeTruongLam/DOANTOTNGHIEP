import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import { message } from "antd";

import "../EditWrite.scss";

export default function LessonVideo({ title, subTitle, chapterId, lessonId }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [method, setMethod] = useState("file");
  const [isEditing, setIsEditing] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    const fetchLessonVideo = async () => {
      try {
        const res = await axios.get(
          `/courses/chapters/${chapterId}/lessons/video/${lessonId}`
        );
        setVideoUrl(res.data.lessonVideo);
      } catch (error) {
        console.error("Error fetching lesson video:", error);
      }
    };
    fetchLessonVideo();
  }, []);

  const handleVideoUrl = (event) => {
    const selectedFile = event.target.value;
    console.log(selectedFile);
    setVideoUrl(selectedFile);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setVideoUrl(selectedFile);
    setPreviewVideo(URL.createObjectURL(selectedFile));
  };

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };
  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      if (videoUrl) {
        if (typeof videoUrl === "string") {
          formData.append("videoUrl", videoUrl);
        } else {
          formData.append("video", videoUrl);
        }
      }
      const response = await axios.put(
        `/users/${chapterId}/uploadLessonVideo/${lessonId}`,
        formData
      );
      message.success("Video đã được thêm thành công");

    } catch (error) {
      message.error(error.message);

    }
    setIsEditing(false);
  };

  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header">
          <p>{title}</p>
          {!isEditing ? (
            <div onClick={handleIconClick} className="course-title-action">
              <EditIcon fontSize="small" />

              <span>{subTitle}</span>
            </div>
          ) : (
            <div onClick={handleCancelClick} className="course-title-action">
              <span>Cancel</span>
            </div>
          )}
        </div>
        <div className="course-title-body">
          {!isEditing ? (
            <div>{videoUrl}</div>
          ) : (
            <>
              <div className="chapter-select">
                <Box className="box-select">
                  <FormControl fullWidth>
                    <Select
                      id="demo-simple-select"
                      native
                      value={method}
                      inputProps={{
                        name: "method",
                        id: "method",
                      }}
                      onChange={(event) => setMethod(event.target.value)}
                    >
                      <option value="file">Select Lesson Video</option>
                      <option value="link">Input Lesson URL</option>
                    </Select>
                  </FormControl>
                </Box>
              </div>
              {method === "file" && (
                <>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    id="chapter-file"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="chapter-file">
                    <Button
                      sx={{ color: "white", backgroundColor: "black" }}
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      style={{ marginTop: "16px" }}
                    >
                      Chọn video
                    </Button>
                  </label>
                </>
              )}
              {method === "link" && (
                <TextField
                  id="image-url"
                  label="Nhập link video chương học"
                  value={videoUrl}
                  style={{ marginTop: "16px" }}
                  fullWidth
                  onChange={handleVideoUrl}
                />
              )}

              <div>
                {previewVideo && (
                  <video className="" controls width="400" height="200">
                    <source src={previewVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <Button
                sx={{ color: "white", backgroundColor: "black" }}
                style={{
                  marginTop: "12px",
                  width: "max-content",
                }}
                variant="contained"
                onClick={handleSaveClick}
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
