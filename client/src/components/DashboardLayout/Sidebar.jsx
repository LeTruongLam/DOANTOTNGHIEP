import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
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
  width: ${(props) => (props.clicked ? "100%" : "0")};
  margin-left: ${(props) => (props.clicked ? "1.5rem" : "0")};
`;

const Sidebar = () => {
  const [click, setClick] = useState(true);

  return (
    <div className="mt-3 min-w-44 grow-[1] border-r border-slate-300 flex flex-col justify-between ">
      <Container>
        <SlickBar clicked={click}>
          <Item exact activeClassName="active" to="/">
            <HomeIcon />
            <Text clicked={click}>Home</Text>
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
            to="/bankquestion"
          >
            <QuizIcon />
            <Text clicked={click}>Bank Questions</Text>
          </Item>
        </SlickBar>
      </Container>
    </div>
  );
};

export default Sidebar;
