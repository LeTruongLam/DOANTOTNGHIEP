import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import AddStudent from "../single/AddStudent";

export default function AddStudentForm({
  isOpen,
  isClose,
  classCode,
  classId,
  courseId,
  fetchClassStudent,
}) {
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
            Thêm sinh viên
            <Button style={{ marginLeft: "auto", justifyContent: "flex-end" }}>
              <CloseIcon onClick={handleClose} />
            </Button>
          </DialogTitle>
          <AddStudent
            classId={classId}
            courseId={courseId}
            classCode={classCode}
            fetchClassStudent={fetchClassStudent}
            isClose={isClose}
          />
        </div>
      </Dialog>
    </div>
  );
}
