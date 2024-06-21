import HeaderLayout from "@/components/DashboardLayout/HeaderLayout";
import React from "react";

function ExamLayout({ children }) {
  return (
    <div className="w-full ">
      <HeaderLayout />
      {children}
    </div>
  );
}

export default ExamLayout;
