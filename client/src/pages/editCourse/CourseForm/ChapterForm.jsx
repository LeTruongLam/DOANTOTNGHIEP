import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import "../EditWrite.scss";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import ChapterTitle from "./ChapterTitle";
import axios from "axios";
import CourseFile from "../CourseComponent/CourseFile";
import ChapterDesc from "../CourseForm/ChapterDesc";
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

  const location = useLocation();
  useEffect(() => {
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
  }, [chapterId]);

  const handleClose = () => {
    isClose();
  };
  return (
    <div>
      <Dialog fullWidth sx={{ m: 1 }} open={isOpen} onClose={handleClose}>
        <div className="form-wrapper">
          <DialogTitle
            style={{ display: "flex", alignItems: "center", padding: 0 }}
          >
            Thông tin chương học
            <Button style={{ marginLeft: "auto", justifyContent: "flex-end" }}>
              <CloseIcon onClick={handleClose} />
            </Button>
          </DialogTitle>
          <ChapterTitle
            title="Chapter Title"
            subTitle="Edit Title"
            chapterId = {chapterId}
          />
          <CourseFile />
          <ChapterDesc
            title="Chapter Description"
            subTitle="Edit Description"
            chapterId = {chapterId}

          />
        </div>
      </Dialog>
    </div>
  );
}
