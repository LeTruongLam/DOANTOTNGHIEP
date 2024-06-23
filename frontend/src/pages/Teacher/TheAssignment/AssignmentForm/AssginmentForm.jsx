import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentTitle from "./AssignmentTitle";
import AssignmentDesc from "./AssignmentDesc";
import AssignmentDate from "./AssginmentDate";
import AssignmentFile from "./AssginmentFile";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
export default function AssginmentForm({
  isOpen,
  isClose,
  chapterId,
  assignmentId,
  fetchAssignmentData,
}) {
  const [startTime, setStartTime] = useState(dayjs());

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
            Thông tin bài tập
            <Button style={{ marginLeft: "auto", justifyContent: "flex-end" }}>
              <CloseIcon onClick={handleClose} />
            </Button>
          </DialogTitle>
          <AssignmentTitle
            title="Tiêu đề bài tập"
            subTitle="Sửa"
            chapterId={chapterId}
            assignmentId={assignmentId}
            fetchAssignmentData={fetchAssignmentData}
          />
          <AssignmentDesc
            title="Mô tả bài tập"
            subTitle="Sửa"
            chapterId={chapterId}
            assignmentId={assignmentId}
            fetchAssignmentData={fetchAssignmentData}
          />
          <AssignmentDate
            title="Ngày đến hạn"
            subTitle="Sửa"
            chapterId={chapterId}
            assignmentId={assignmentId}
            fetchAssignmentData={fetchAssignmentData}
          />

          <AssignmentFile chapterId={chapterId} assignmentId={assignmentId} />
        </div>
      </Dialog>
    </div>
  );
}
