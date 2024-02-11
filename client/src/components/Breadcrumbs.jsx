import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
const TheBreadcrumbs = ({ courseTitle }) => {
  return (
    <div role="presentation" className="mt-2 mb-6">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="white" href="/course" className="flex ">
          <AutoStoriesIcon sx={{ mr: 1 }} fontSize="medium" />
          <span>Course</span>
        </Link>
        <span className="text-white">/</span>
        <span className="text-white">{courseTitle}</span>
      </Breadcrumbs>
    </div>
  );
};
export default TheBreadcrumbs;
