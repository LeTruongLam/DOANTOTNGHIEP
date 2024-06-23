import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { message } from "antd";
import Stack from "@mui/material/Stack";
import { Container, Draggable } from "react-smooth-dnd";
import { arrayMoveImmutable as arrayMove } from "array-move";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";

export default function CourseChapter({ title, subTitle, handleEdit }) {
  const location = useLocation();
  const { fetchChapter } = useContext(AuthContext);
  const [chapterData, setChapterData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [isDrop, setIsDrop] = useState(false);
  const onDrop = ({ removedIndex, addedIndex }) => {
    setChapterData((items) => arrayMove(items, removedIndex, addedIndex));
    setIsDrop(true);
  };

  const handleChapterOrder = async () => {
    const chapterIds = chapterData.map((chapter) => chapter.ChapterId);
    try {
      await axios.put(
        `http://localhost:8800/api/courses/chapters/updateOrder`,
        {
          chapterOrder: chapterIds,
        }
      );
      setIsDrop(false);
      message.success("Thay đổi vị trí thành công");
    } catch (err) {
      message.error("Lỗi khi thay đổi vị trí");
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      const data = await fetchChapter(location.state?.CourseId);

      setChapterData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleDelete = async (chapterId) => {
    try {
      await axios.delete(
        `http://localhost:8800/api/courses/${chapterId}/chapters`
      );
      message.success("Xóa thành công");
      fetchData();
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };
  const chapterItems = chapterData.map((chapter) => (
    <Draggable
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
      className="bg-white rounded-lg mr-2 lesson-content"
      key={chapter.ChapterId}
    >
      <div className="lesson-content-left">
        <DragIndicatorOutlinedIcon className="drag-handle" />
        {chapter.ChapterTitle}
      </div>
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Stack direction="row" spacing={1}>
          <button
            onClick={() => {
              handleDelete(chapter.ChapterId);
            }}
            className="mr-2 text-xs	 rounded-2xl	 	  px-2.5 py-1   font-semibold text-gray-900   ring-gray-300 hover:text-blue-500	"
          >
            Xóa
          </button>
          <button
            onClick={() => {
              handleEdit(chapter.ChapterId);
            }}
            className="mr-2 text-xs	 rounded-2xl	 bg-black	 text-white px-2.5 py-1  font-semibold    ring-gray-300 hover:bg-blue-500	"
          >
            Sửa
          </button>
        </Stack>
      </span>
    </Draggable>
  ));

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };
  const handleCancelClick = () => {
    setIsEditing(false);
  };
  const handleSaveClick = async () => {
    try {
      await axios.post(`http://localhost:8800/api/courses/chapters/title`, {
        chapterTitle: chapterTitle,
        courseId: location.state?.CourseId,
      });
      message.success("Thêm thành công!");
    } catch (error) {
      message.error(error);
    }
    setIsEditing(false);
    fetchData();
    setChapterTitle(""); // Trả lại input trống
  };
  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header  mt-3 mb-3">
          <p>{title}</p>
          {!isEditing ? (
            <div
              onClick={handleIconClick}
              className="course-title-action items-center"
            >
              <AddCircleOutlineOutlinedIcon fontSize="small" />
              <span>{subTitle}</span>
            </div>
          ) : (
            <div onClick={handleCancelClick} className="course-title-action">
              <span>Hủy</span>
            </div>
          )}
        </div>
        <div className="course-title-body">
          {!isEditing ? (
            !chapterData[0] ? (
              <div className="italic text-slate-400		">Không có chương học</div>
            ) : (
              <Container
                dragHandleSelector=".drag-handle"
                lockAxis="y"
                onDrop={onDrop}
              >
                {chapterItems}
              </Container>
            )
          ) : (
            <div className="grid">
              <TextField
                value={chapterTitle}
                className="bg-main"
                onChange={(e) => setChapterTitle(e.target.value)}
              />
              <button
                className="text-white border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
                onClick={handleSaveClick}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
        <div className="course-title-footer ">
          {isDrop && !isEditing ? (
            <button
              onClick={() => {
                handleChapterOrder();
              }}
              className="text-white border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
            >
              Thay đổi thứ tự chương học
            </button>
          ) : (
            chapterData[0] && (
              <div className=" text-slate-400	 italic">
                Bấm vào biểu tượng và kéo thả để thay đổi thứ tự chương
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
