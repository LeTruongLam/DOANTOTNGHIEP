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
import ChapterFile from "../CourseForm/ChapterFile";
import ChapterDesc from "../CourseForm/ChapterDesc";
export default function ChapterForm({ isOpen, isClose, chapterId, type }) {
  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      if (chapterId) {
        try {
          const response = await axios.get(
            `http://localhost:8800/api/courses/${location.state.CourseId}/chapters/${chapterId}`
          );
          const chapterData = response.data;
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
        <div className="form-wrapper scroll">
          <DialogTitle
            style={{ display: "flex", alignItems: "center", padding: 0 }}
          >
            Thông tin chương học
            <Button style={{ marginLeft: "auto", justifyContent: "flex-end" }}>
              <CloseIcon onClick={handleClose} />
            </Button>
          </DialogTitle>
          <ChapterTitle
            title="Tiêu đề chương học"
            subTitle="Sửa"
            chapterId={chapterId}
          />
          <ChapterFile chapterId={chapterId} />
          <ChapterDesc
            title="Mô  tả chương học"
            subTitle="Sửa"
            chapterId={chapterId}
          />
        </div>
      </Dialog>
    </div>
  );
}
