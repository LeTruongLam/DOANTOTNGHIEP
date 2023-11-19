import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import InputLabel from "@mui/material/InputLabel";
import "./EditWrite.scss";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";

import axios from "axios";

export default function ChapterForm({
  isOpen,
  isClose,
  chapterId,
  type,
  fetchChapter,
}) {
  const [chapterTitle, setChapterTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [chapterDesc, setChapterDesc] = useState("");
  const [previewVideo, setPreviewVideo] = useState(null);

  const location = useLocation();
  useEffect(() => {
    console.log(type);
    const fetchData = async () => {
      if (chapterId && type === "edit") {
        try {
          const response = await axios.get(
            `/courses/${location.state.CourseId}/chapters/${chapterId}`
          );
          const chapterData = response.data;
          setChapterTitle(chapterData.ChapterTitle);
          setVideoUrl(chapterData.ChapterVideo);
          setChapterDesc(chapterData.ChapterDesc);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [chapterId, location.state.CourseId]);

  const handleChapterTitle = (event) => {
    setChapterTitle(event.target.value);
    console.log(chapterTitle);
  };

  const handleVideoUrl = (event) => {
    const selectedFile = event.target.value;
    console.log(selectedFile);
    setVideoUrl(selectedFile);
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    if (location.state) {
      const courseId = location.state.CourseId;
      const formData = new FormData();
      formData.append("chapterTitle", chapterTitle);
      formData.append("chapterDesc", chapterDesc);
      formData.append("courseId", courseId);
      if (videoUrl) {
        if (typeof videoUrl === "string") {
          formData.append("videoUrl", videoUrl);
        } else {
          formData.append("video", videoUrl);
        }
      }
      if (chapterId && type === "add") {
        await axios
          .post("/users/uploadVideo", formData)
          .then((response) => {
            const data = response.data;
            if (data.success) {
            } else {
              console.log("Error:", data.message);
            }
            isClose();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else if (chapterId && type === "edit") {
        await axios
          .put(`/users/updateChapter/${chapterId}`, formData)
          .then((response) => {
            const data = response.data;
            if (data.success) {
              // Handling for successful update
            } else {
              console.log("Error:", data.message);
            }
            isClose();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    } else {
      console.log("Chưa có môn học");
    }
    fetchChapter();

  };

  const handleClose = () => {
    isClose();
  };

  const [method, setMethod] = useState("file");

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
    console.log(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setVideoUrl(selectedFile);
    setPreviewVideo(URL.createObjectURL(selectedFile));
  };
  return (
    <div>
      <Dialog fullWidth sx={{ m: 1 }} open={isOpen} onClose={handleClose}>
        <DialogTitle
          id="edit-apartment"
          style={{ display: "flex", alignItems: "center" }}
        >
          Thông tin chương học
          <Button style={{ marginLeft: "auto", justifyContent: "flex-end" }}>
            <CloseIcon onClick={handleClose} />
          </Button>
        </DialogTitle>
        <div className="chapter-title">
          <TextField
            id="outlined-basic"
            label="Nhập tên chương học"
            value={chapterTitle}
            onChange={handleChapterTitle}
            style={{ minWidth: "100%" }}
          />
        </div>
        <div className="chapter-video">
          <Box fullWidth>
            <FormControl style={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-label">
                Video chương học
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label=" Video chương học"
                native
                value={method}
                onChange={handleMethodChange}
                inputProps={{
                  name: "method",
                  id: "method",
                }}
              >
                <option value="file">Chọn video</option>
                <option value="link">Nhập link video</option>
              </Select>
            </FormControl>
          </Box>
        </div>
        {method === "file" && (
          <div className="chapter-video">
            <input
              type="file"
              style={{ display: "none" }}
              id="chapter-file"
              accept="video/*"
              onChange={handleFileChange}
            />
            <label htmlFor="chapter-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                style={{ height: "56px" }}
              >
                Chọn video
              </Button>
            </label>
          </div>
        )}
        {method === "link" && (
          <div className="chapter-video">
            <TextField
              id="image-url"
              label="Nhập link video chương học"
              value={videoUrl}
              style={{ minWidth: "100%" }}
              onChange={handleVideoUrl}
            />
          </div>
        )}

        {previewVideo && (
          <video className="mr-24" controls width="200" height="200">
            <source src={previewVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="chapter-desc">
          <b>Mô tả chương học</b>
          <ReactQuill
            className="editor"
            theme="snow"
            value={chapterDesc}
            onChange={setChapterDesc}
          />
        </div>
        <DialogActions className="mr-16">
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitForm} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
