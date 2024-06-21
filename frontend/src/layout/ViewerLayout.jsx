import React from "react";
import HeaderView from "@/components/ViewLayout/HeaderView";
function ViewerLayout({ children }) {
  return (
    <>
      <HeaderView />
      <div className="mr-4">{children}</div>
    </>
  );
}

export default ViewerLayout;
