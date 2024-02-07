import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
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
    border-right: 2px solid  rgb(209 213 219) ;
    color: rgb(147 51 234);
  }
`;

const Text = styled.span`
  margin-left: 1.5rem;
`;

const Sidebar = () => {
  return (
    <div className=" min-w-[250px] border-r border-slate-300 flex flex-col justify-between ">
      <Container>
        <SlickBar>
          <Item exact activeClassName="active" to="/">
            <HomeIcon />
            <Text className="inline ">Home</Text>
          </Item>
          <Item activeClassName="active" to="/dashboard">
            <ListAltIcon />
            <Text>Courses</Text>
          </Item>
          <Item activeClassName="active" to="/calender">
            <CalendarMonthIcon />
            <Text>Calender</Text>
          </Item>
          <Item activeClassName="active" to="/assignment">
            <AssignmentIndIcon />
            <Text>Assignments</Text>
          </Item>
          <Item activeClassName="active" to="/bankquestion">
            <QuizIcon />
            <Text className="inline">Bank Questions</Text>
          </Item>
        </SlickBar>
      </Container>
    </div>
  );
};

export default Sidebar;
