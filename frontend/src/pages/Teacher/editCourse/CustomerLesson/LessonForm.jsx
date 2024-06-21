import React from "react";
import "react-quill/dist/quill.snow.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import "../EditWrite.scss";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import LessonTitle from "./LessonTitle";
import LessonVideo from "./LessonVideo";
import LessonDesc from "./LessonDesc";
export default function LessonForm({
  isOpen,
  isClose,
  chapterId,
  lessonId,
  fetchLessonData,
}) {
  const handleClose = () => {
    isClose();
  };
  return (
    <div>
      <Dialog
        className="scroll"
        fullWidth
        sx={{ m: 1 }}
        open={isOpen}
        onClose={handleClose}
      >
        <div className="form-wrapper scroll">
          <DialogTitle
            style={{ display: "flex", alignItems: "center", padding: 0 }}
          >
            Thông tin bài học
            <Button style={{ marginLeft: "auto", justifyContent: "flex-end" }}>
              <CloseIcon onClick={handleClose} />
            </Button>
          </DialogTitle>
          <LessonTitle
            title="Tiêu đề bài học"
            subTitle="Sửa"
            chapterId={chapterId}
            lessonId={lessonId}
            fetchLessonData={fetchLessonData}
          />
          <LessonVideo
            title="Video bài học"
            subTitle="Sửa"
            chapterId={chapterId}
            lessonId={lessonId}
          />
          <LessonDesc
            title="Mô tả bài học"
            subTitle="Sửa"
            chapterId={chapterId}
            lessonId={lessonId}
          />
        </div>
      </Dialog>
    </div>
  );
}
