import React from "react";
import "react-quill/dist/quill.snow.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import "../EditWrite.scss";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentTitle from "./AssignmentTitle";
import AssignmentDesc from "./AssignmentDesc";
import AssignmentDate from "./AssginmentDate";
import AssignmentFile from "./AssginmentFile";
export default function AssginmentForm({
  isOpen,
  isClose,
  chapterId,
  assignmentId,
  fetchAssignmentData,
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
            Thông tin bài tập
            <Button style={{ marginLeft: "auto", justifyContent: "flex-end" }}>
              <CloseIcon onClick={handleClose} />
            </Button>
          </DialogTitle>
          <AssignmentTitle
            title="Assignment Title"
            subTitle="Edit Title"
            chapterId={chapterId}
            assignmentId={assignmentId}
            fetchAssignmentData={fetchAssignmentData}
          />
          <AssignmentDesc
            title="Assignment Description"
            subTitle="Edit  Description"
            chapterId={chapterId}
            assignmentId={assignmentId}
          />
          <AssignmentDate
            title="Assignment Date"
            subTitle="Edit  Date"
            chapterId={chapterId}
            assignmentId={assignmentId}
          />
          <AssignmentFile
            title="Assignment Date"
            subTitle="Edit  Date"
            chapterId={chapterId}
            assignmentId={assignmentId}
          />
        </div>
      </Dialog>
    </div>
  );
}
