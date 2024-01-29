import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const Sidebar = () => {
  return (
    <div className="flex gap-6">
      <div className="mt-3 min-w-44 grow-[1] border-r border-slate-300 flex flex-col justify-between ">
        <div>
          <Link to={"/dashboard"}
            className=" outline-none mb-3 w-full flex py-3 border-white gap-2 text-base pl-5 hover:text-purple-600 focus:text-purple-600 focus-visible:bg-slate-100 hover:bg-cyan-200 border-r-4 focus:border-sky-500 focus:border-r-4 focus:bg-cyan-100"
            autoFocus // thêm thuộc tính autofocus vào nút "Course"
          >
            <FormatListBulletedIcon />
            <span>Course</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
