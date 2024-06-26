import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import QuizIcon from "@mui/icons-material/Quiz";

export default function SpeedDialTooltipOpen() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRedirect = () => {
    setOpen(false);
    navigate(`/teacher/courses/${courseId}/exams`); // Thay thế "/your-page-url" bằng URL của trang bạn muốn chuyển đến
  };

  return (
    <Box>
      <Backdrop open={open} style={{ zIndex: "1000" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<QuizIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        onClick={handleRedirect}
      ></SpeedDial>
    </Box>
  );
}
