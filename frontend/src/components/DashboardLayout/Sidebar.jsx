import React, { useContext } from "react";
import HomeIcon from "@mui/icons-material/Home";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { AdminLinks, TeacherLinks } from "@/constants";
import { AuthContext } from "@/context/authContext";

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
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const links = currentUser?.Role === "admin" ? AdminLinks : TeacherLinks;

  const isActiveLink = (linkRoute) => {
    if (linkRoute.includes("assignments") && location.pathname.includes("assignments")) {
      return true;
    }
    if (linkRoute.includes("bankquestions") && location.pathname.includes("bankquestions")) {
      return true;
    }
    return location.pathname === linkRoute;
  };

  return (
    <div className="min-w-[250px] border-r h-[100vh] border-slate-300 flex flex-col justify-between">
      <Container>
        <SlickBar>
          <Item
            exact
            className="mt-10 hover:bg-slate-200"
            activeClassName="active"
            to="/"
          >
            <HomeIcon />
            <Text className="inline">Trang chủ</Text>
          </Item>
          {links.map((link, index) => (
            <Item
              key={index}
              to={link.route}
              className={`hover:bg-slate-200 ${isActiveLink(link.route) ? "active" : ""}`}
            >
              {link.icon}
              <Text>{link.label}</Text>
            </Item>
          ))}
        </SlickBar>
      </Container>
    </div>
  );
};

export default Sidebar;
