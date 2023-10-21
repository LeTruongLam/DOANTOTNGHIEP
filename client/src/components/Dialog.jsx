import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

export default function AlertDialog(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [chapterName, setChapterName] = useState("");
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    handleCloseDialog(); // Đảm bảo đóng hộp thoại trước khi mở menu
  };

  const handleDelete = () => {
    props.deleteEvent();
    handleClose();
  };

  const handleAdd = () => {
    props.addEvent(chapterName);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setChapterName("");
  };

  return (
    <div>
      <MoreHorizIcon onClick={handleClick} />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClickOpen}>Thêm</MenuItem>
        <MenuItem onClick={handleClose}>Sửa</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Thêm chương học</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tên chương học"
            type="text"
            fullWidth
            variant="standard"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleAdd}>Đồng ý</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}