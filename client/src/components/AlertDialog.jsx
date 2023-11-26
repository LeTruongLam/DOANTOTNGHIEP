import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import ChapterFrom from "../pages/editCourse/CourseForm/ChapterForm";

export default function AlertDialog({ deleteEvent, fetchChapter, chapterId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    handleCloseDialog(); // Đảm bảo đóng hộp thoại trước khi mở menu
  };

  const handleDelete = () => {
    deleteEvent();
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAdd = () => {
    handleClickOpen();
    setType("add");
  };
  const handleEdit = () => {
    handleClickOpen();
    setType("edit");
  };
  const handleClickOpen = () => {
    setOpen(true);
    handleClose();
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <div>
      <MoreHorizIcon onClick={handleClick} />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleAdd}>Thêm</MenuItem>
        <MenuItem onClick={handleEdit}>Sửa</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>

      {open && (
        <ChapterFrom
          isOpen={open}
          fetchChapter={fetchChapter}
          chapterId={chapterId}
          isClose={handleCloseDialog}
          type={type}
        ></ChapterFrom>
      )}
    </div>
  );
}
