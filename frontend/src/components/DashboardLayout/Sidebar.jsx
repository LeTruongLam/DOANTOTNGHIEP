import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
const Container = styled.div`
  .active {
    border-right-width: 2px;
    --tw-border-opacity: 1;
    border-color: rgb(37 99 235 / var(--tw-border-opacity));
    color: rgb(147 51 234);
  }
`;
const SlickBar = styled.ul`
  color: var(--white);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--white);
  transition: all 0.5s ease;
`;
const Item = styled(NavLink)`
  text-decoration: none;
  color: var(--black);
  width: 100%;
  padding: 1rem 0;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-left: 1rem;
  &:hover {
    border-right: 2px solid rgb(209 213 219);
    color: rgb(147 51 234);
  }
`;

const Text = styled.span`
  margin-left: 1.5rem;
`;

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className=" min-w-[250px] border-r h-[100vh] border-slate-300 flex flex-col justify-between ">
      <Container>
        <SlickBar>
          <Item
            exact
            className="mt-10 hover:bg-slate-200 "
            activeClassName="active"
            to="/"
          >
            <HomeIcon />
            <Text className="inline ">Trang chủ</Text>
          </Item>
          <Item
            activeClassName="active"
            to="/teacher/courses"
            className={`${
              location.pathname.endsWith("/detail") ? "active" : ""
            } hover:bg-slate-200`}
          >
            <ListAltIcon />
            <Text>Môn học</Text>
          </Item>
          <Item
            activeClassName="active"
            to="/teacher/assignments"
            className={`${
              location.pathname === "/assignments" ||
              location.pathname.startsWith("/assignments/")
                ? "active"
                : ""
            } hover:bg-slate-200`}
          >
            <AssignmentIndIcon />
            <Text>Bài tập</Text>
          </Item>
          <Item
            className="hover:bg-slate-200"
            activeClassName="active"
            to="/teacher/bankquestions"
          >
            <AccountBalanceIcon />
            <Text className="inline">Ngân hàng câu hỏi</Text>
          </Item>
        </SlickBar>
      </Container>
    </div>
  );
};

export default Sidebar;
