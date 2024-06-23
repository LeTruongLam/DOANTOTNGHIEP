import "react-quill/dist/quill.snow.css";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import "../EditWrite.scss";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ChapterDesc from "../CustomerChapter/ChapterDesc";
import ChapterTitle from "../CustomerChapter/ChapterTitle";
import CourseLesson from "../../../../components/Course/CourseLesson";
import { useNavigate } from "react-router-dom";
import CourseMaterials from "../../../../components/Course/CourseMaterials";
const ChapterStepper = ({
  chapterId,
  handleBack,
  handleNext,
  setSelectedLessonId,
  courseId,
}) => {
  const navigate = useNavigate();
  return (
    <div className="grow-[3]">
      <div className="flex justify-between py-3 m-3 items-center	">
        <p className="text-2xl	font-semibold	">Chi tiết chương học</p>
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
          <ChapterTitle
            chapterId={chapterId}
            title="Tiêu đề chương học"
            subTitle="Sửa "
          />
          <div className="editorContainer">
            <ChapterDesc
              chapterId={chapterId}
              title="Mô tả chương học"
              subTitle="Sửa "
            />
          </div>
        </div>
        <div className="course-custom">
          <div className="course-custom-title">
            <div className="course-custom-icon">
              <CastForEducationIcon />
            </div>
            <p className="text-xl	font-semibold	">Thiết lập bài học</p>
          </div>
          <CourseLesson
            handleNext={handleNext}
            setSelectedLessonId={setSelectedLessonId}
            chapterId={chapterId}
            title="Bài học "
            subTitle="Thêm "
          />
          <CourseMaterials
            chapterId={chapterId}
            title="Tài liệu chương học"
            subTitle="Thêm "
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterStepper;
