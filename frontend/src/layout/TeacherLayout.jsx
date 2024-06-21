import HeaderLayout from "@/components/DashboardLayout/HeaderLayout";
import Sidebar from "@/components/DashboardLayout/Sidebar";
function TeacherLayout({ children }) {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="w-full ">
        <HeaderLayout />
        {children}
      </div>
    </div>
  );
}

export default TeacherLayout;
