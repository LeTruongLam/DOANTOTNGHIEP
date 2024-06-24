import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";
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
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Container = styled.div`
  .active {
    border-bottom-width: 2px;
    --tw-border-opacity: 1;
    border-color: rgb(37 99 235 / var(--tw-border-opacity));
    color: rgb(147 51 234);
  }
`;
const SlickBar = styled.ul`
  color: var(--white);
  display: flex;
  flex-direction: row;
  background-color: var(--white);
`;
const Item = styled(NavLink)`
  color: var(--black);
  cursor: pointer;
  display: flex;
  &:hover {
    border-bottom: 2px solid rgb(209 213 219);
    color: rgb(147 51 234);
  }
`;

const TheHeader = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [checked, setChecked] = React.useState(false);
  const [click, setClick] = useState(true);

  const handleChecked = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      navigate("/teacher/courses");
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
  return (
    <div className="navbar mx-5 ">
      <div className="navbar-container ">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="flex">
          <Container className="">
            <SlickBar className="h-full items-center " clicked={click}>
              <Item exact activeClassName="active" to="/">
                <span className="py-4 mx-2 font-semibold" clicked={click}>
                  Trang chủ
                </span>
              </Item>
              <Item activeClassName="active" to="/courses">
                <span className="py-4 mx-2 font-semibold" clicked={click}>
                  Môn học
                </span>
              </Item>
            </SlickBar>
          </Container>
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
                      {currentUser?.UserName}
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
                  <Avatar /> Tài khoản
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
            <div className="content ml-5">
              <Link to="/login">
                <Button variant="contained">Đăng nhập</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheHeader;
