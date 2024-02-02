import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
const Container = styled.div`
  .active {
    border-right: 4px solid rgb(14 165 233);
    background-color: rgb(165 243 252);
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
  padding-left: 1rem;
  &:hover {
    border-right: 4px solid rgb(14 165 233);
    background-color: rgb(165 243 252);
    color: rgb(147 51 234);
  }
`;

const Text = styled.span`

  margin-left: 1.5rem;
`;

const Sidebar = () => {
  const [click, setClick] = useState(true);

  return (
    <div className=" min-w-[250px] border-r border-slate-300 flex flex-col justify-between ">
      <Container>
        <SlickBar clicked={click}>
          <Item exact activeClassName="active" to="/">
            <HomeIcon />
            <Text className="inline" clicked={click}>Home</Text>
          </Item>
          <Item activeClassName="active" to="/dashboard">
            <ListAltIcon />
            <Text clicked={click}>Courses</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/calender"
          >
            <CalendarMonthIcon />
            <Text clicked={click}>Calender</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/assignment"
          >
            <AssignmentIndIcon />
            <Text clicked={click}>Assignments</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/bankquestion"
          >
            <QuizIcon />
            <Text className="inline" >Bank Questions</Text>
          </Item>
        </SlickBar>
      </Container>
    </div>
  );
};

export default Sidebar;
