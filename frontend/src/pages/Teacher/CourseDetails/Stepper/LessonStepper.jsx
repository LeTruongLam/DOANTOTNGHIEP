import "react-quill/dist/quill.snow.css";
import "../EditWrite.scss";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import LessonTitle from "../CustomerLesson/LessonTitle";
import LessonDesc from "../CustomerLesson/LessonDesc";
import LessonVideo from "../CustomerLesson/LessonVideo";
import { useNavigate } from "react-router-dom";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
const LessonStepper = ({ chapterId, handleBack, lessonId }) => {
  const navigate = useNavigate();

  return (
    <div className="grow-[3]">
      <div className="flex justify-between py-3 m-3 items-center	">
        <p className="text-2xl	font-semibold	">Chi tiết bài học</p>
        <p>
          <button
            onClick={() => {
              handleBack();
            }}
            type="button"
            className="mr-2 rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900  ring-gray-300 hover:bg-blue-50 "
          >
            Quay lại
          </button>
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="text-white text-sm border-none bg-gray-800 mt-3 py-1.5 rounded-md px-3 w-max hover:bg-gray-700"
          >
            Hoàn tất
          </button>
        </p>
      </div>
      <div className="course-container ">
        <div className="course-custom">
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <GridViewOutlinedIcon />
            </div>
            <p className="text-xl	font-semibold	">Thiết lập chương học</p>
          </div>
          <LessonTitle
            chapterId={chapterId}
            lessonId={lessonId}
            title="Tiêu đề bài học"
            subTitle="Sửa"
          />
          <div className="editorContainer">
            <LessonDesc
              chapterId={chapterId}
              lessonId={lessonId}
              title="Mô tả bài học"
              subTitle="Sửa"
            />
          </div>
        </div>
        <div className="course-custom">
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <VideocamOutlinedIcon />
            </div>
            <p className="text-xl	font-semibold	">Thêm video bài học</p>
          </div>
          <LessonVideo
            chapterId={chapterId}
            lessonId={lessonId}
            title="Video bài học"
            subTitle="Sửa"
          />
        </div>
      </div>
    </div>
  );
};

export default LessonStepper;
