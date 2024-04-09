import * as React from "react";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import QuizIcon from "@mui/icons-material/Quiz";

export default function SpeedDialTooltipOpen() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Backdrop open={open} style={{zIndex:"1000"}} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<QuizIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      ></SpeedDial>
    </Box>
  );
}
