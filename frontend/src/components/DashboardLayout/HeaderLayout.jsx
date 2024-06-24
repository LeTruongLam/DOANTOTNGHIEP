import React, { useState, useEffect } from "react";
import { useContext } from "react";

import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import Switch from "@mui/material/Switch";
const HeaderLayout = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [checked, setChecked] = React.useState(() => {
    const initialChecked = localStorage.getItem("teacherMode");
    return initialChecked;
  });

  React.useEffect(() => {
    localStorage.setItem("teacherMode", true);
  }, [checked]);

  const handleChecked = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      navigate("/dashboard");
    } else {
      navigate("/courses");
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleToProfile = () => {
    navigate("/info");
  };
  const handleExit = () => {
    navigate("/courses");
  };
  return (
    <div className="pr-6 navbar flex justify-end">
      <div className="navbar-container ">
        {currentUser.Role === "teacher" && (
          <div className="links " onClick={handleExit}>
            <ExitToAppIcon />
            <span>Thoát chế độ</span>
          </div>
        )}

        <div className="links ">
          {currentUser ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {currentUser?.UserName[0]}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleToProfile}>
                  <Avatar /> My account
                </MenuItem>
                <Divider />
                {currentUser.Role === "teacher" && (
                  <MenuItem>
                    <ListItemIcon>
                      <Switch
                        checked={checked}
                        onChange={handleChecked}
                        size="small"
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </ListItemIcon>
                    Chế độ giáo viên
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <div className="content">
              <Link to="/login">
                <Button variant="contained">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="contained">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderLayout;
