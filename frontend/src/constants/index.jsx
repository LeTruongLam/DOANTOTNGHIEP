import {
  GraduationCap,
  Landmark,
  LayoutDashboard,
  NotepadText,
} from "lucide-react";

export const AdminLinks = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Quản lý tài khoản",
    route: "/admin/manage-accounts",
  },
];
export const TeacherLinks = [
  {
    icon: <GraduationCap className="h-5 w-5" />,
    label: "Môn học",
    route: "/teacher/courses",
  },
  {
    icon: <NotepadText className="h-5 w-5" />,
    label: "Bài tập",
    route: "/teacher/assignments",
  },
  {
    icon: <Landmark className="h-5 w-5" />,
    label: "Ngân hàng câu hỏi",
    route: "/teacher/bankquestions",
  },
];
