import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { useParams } from "react-router-dom";
import { formatDateString, getText } from "@/js/TAROHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClassMenu from "@/components/SelectMenus/ClassMenu";
import DeleteIcon from "@mui/icons-material/Delete";

import AssginmentForm from "./AssignmentForm/AssginmentForm";
import { message } from "antd";
import AddAssignmentForm from "@/components/Dialogs/AddAssignmentForm";

const AssignmentsViewPage = () => {
  const [course, setCourse] = useState();
  const [openAddForm, setOpenAddForm] = useState(false);

  const { courseId } = useParams();
  const { fetchChapter, fetchCourseById } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [chapterId, setChapterId] = useState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [selected, setSelected] = useState();
  const [openForm, setOpenForm] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState();
  const navigate = useNavigate();
  const handleToAssignment = (assignment) => {
    navigate(
      `/teacher/courses/${courseId}/assignments/${assignment.AssignmentId}/classrooms`
    );
  };
  const fetchAssignmentsByChapter = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignments`
      );
      setAssignments(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchCourseData = async () => {
    try {
      let res = await fetchCourseById(courseId);
      setCourse(res);
    } catch (error) {}
  };
  const fetchChapterData = async () => {
    try {
      const chapterData = await fetchChapter(courseId);
      setChapters(chapterData);
      setSelected(chapterData[0]);
      setChapterId(chapterData[0].ChapterId);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCourseData();
    fetchChapterData();
  }, []);
  useEffect(() => {
    fetchAssignmentsByChapter();
  }, [chapterId]);

  const handleDeleteClick = async (assignmentId) => {
    try {
      await axios.delete(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignments/${assignmentId}`
      );
      message.success("Xóa thành công!");
      fetchAssignmentsByChapter();
    } catch (error) {
      console.log(error);
    }
  };

  const onCloseForm = () => {
    setOpenForm(false);
  };
  const onShowForm = async (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setOpenForm(true);
  };
  return (
    <div className="px-5">
      {openForm && (
        <AssginmentForm
          isOpen={openForm}
          isClose={onCloseForm}
          selectedAssignmentId={selectedAssignmentId}
          chapterId={chapterId}
          assignmentId={selectedAssignmentId}
          fetchAssignmentData={fetchAssignmentsByChapter}
        ></AssginmentForm>
      )}
      {openAddForm && (
        <AddAssignmentForm
          chapterId={chapterId}
          courseId={courseId}
          open={openAddForm}
          setOpen={setOpenAddForm}
          title="Tạo bài tập chương học"
          fetchAssignmentData={fetchAssignmentsByChapter}
        />
      )}

      <div className="flex justify-between items-center px-3 mt-3 border-b border-slate-300 pb-3">
        <span className="text-xl font-bold text-blue-600">
          {course?.title} - {course?.CourseCode}
        </span>
      </div>
      <div
        className="rounded-b-lg min-h-[600px]"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <div className="p-3 pb-0 flex justify-end items-center ">
          <div className="flex justify-between items-center gap-3">
            <div>
              <ClassMenu
                setSelected={setSelected}
                selected={selected}
                chapters={chapters}
                setChapterId={setChapterId}
              />
            </div>
            {selectedIds.length === 0 ? (
              <button
                onClick={() => setOpenAddForm(true)}
                className="bg-blue-700 text-sm rounded-md font-semibold text-white py-2 px-3"
              >
                Tạo bài tập
              </button>
            ) : (
              <div
                onClick={() => {
                  handleDeleteClick(assignment.AssignmentId);
                }}
                className="flex justify-center items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:rounded-md hover:cursor-pointer"
              >
                <DeleteIcon
                  style={{ color: "rgb(220 38 38)", fontSize: "20px" }}
                />
                <span className="text-red-600 text-sm font-semibold">Xóa</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-3">
          <div className="  shadow-sm sm:rounded-lg p-4 bg-white ">
            <div className="min-h-[480px] max-h-[500px] overflow-y-auto">
              {assignments && assignments?.length > 0 ? (
                <table className="w-full  text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-sm text-black font-normal">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-2"
                        style={{ width: "30%" }}
                      >
                        Tiêu đề bài tập
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2"
                        style={{ width: "30%" }}
                      >
                        Mô tả bài tập
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2"
                        style={{ width: "10%" }}
                      >
                        Hạn nộp bài
                      </th>
                      <th
                        scope="col"
                        className="px-6 text-center py-2"
                        style={{ width: "30%" }}
                      >
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments?.map((assignment) => (
                      <tr
                        key={assignment?.AssignmentId}
                        className="bg-white border-t border-slate-300 hover:bg-zinc-100"
                      >
                        <td className="px-6 py-3 max-w-96 truncate">
                          <span title={assignment?.AssignmentTitle}>
                            {assignment?.AssignmentTitle}
                          </span>
                        </td>
                        <td className="px-6 py-3 max-w-96  truncate ...">
                          {getText(assignment?.AssignmentDesc)}
                        </td>

                        <td className="px-6 py-2 truncate">
                          {formatDateString(assignment?.EndDate)}
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <button
                            onClick={() => {
                              handleDeleteClick(assignment.AssignmentId);
                            }}
                            className="font-semibold text-xs text-blue-600 dark:text-blue-500 hover:underline"
                          >
                            Xóa
                          </button>
                          <button
                            onClick={() => {
                              onShowForm(assignment?.AssignmentId);
                            }}
                            className="font-semibold text-xs text-blue-600 dark:text-blue-500 hover:underline"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => {
                              handleToAssignment(assignment);
                            }}
                            className="font-semibold text-xs bg-blue-600 text-white text-blue-600 dark:text-blue-500 hover:underline"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex gap-6 flex-col justify-center items-center w-full min-h-[480px] max-h-[500px]">
                  <div className="w-full flex items-center flex-wrap justify-center gap-10">
                    <div className="grid gap-4 w-60">
                      <div className="w-20 h-20 mx-auto bg-slate-200 rounded-full shadow-sm justify-center items-center inline-flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="33"
                          height="32"
                          viewBox="0 0 33 32"
                          fill="none"
                        >
                          <g id="File Serch">
                            <path
                              id="Vector"
                              d="M19.9762 4V8C19.9762 8.61954 19.9762 8.92931 20.0274 9.18691C20.2379 10.2447 21.0648 11.0717 22.1226 11.2821C22.3802 11.3333 22.69 11.3333 23.3095 11.3333H27.3095M18.6429 19.3333L20.6429 21.3333M19.3095 28H13.9762C10.205 28 8.31934 28 7.14777 26.8284C5.9762 25.6569 5.9762 23.7712 5.9762 20V12C5.9762 8.22876 5.9762 6.34315 7.14777 5.17157C8.31934 4 10.205 4 13.9762 4H19.5812C20.7604 4 21.35 4 21.8711 4.23403C22.3922 4.46805 22.7839 4.90872 23.5674 5.79006L25.9624 8.48446C26.6284 9.23371 26.9614 9.60833 27.1355 10.0662C27.3095 10.524 27.3095 11.0253 27.3095 12.0277V20C27.3095 23.7712 27.3095 25.6569 26.138 26.8284C24.9664 28 23.0808 28 19.3095 28ZM19.3095 16.6667C19.3095 18.5076 17.8171 20 15.9762 20C14.1352 20 12.6429 18.5076 12.6429 16.6667C12.6429 14.8257 14.1352 13.3333 15.9762 13.3333C17.8171 13.3333 19.3095 14.8257 19.3095 16.6667Z"
                              stroke="#4F46E5"
                              stroke-width="1.6"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-center text-black text-xl font-semibold leading-loose pb-2">
                          Không có bài tập nào
                        </h2>
                        <p className="text-center text-black text-base font-normal leading-relaxed pb-4">
                          Hãy cập nhật thêm bài tập
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsViewPage;
