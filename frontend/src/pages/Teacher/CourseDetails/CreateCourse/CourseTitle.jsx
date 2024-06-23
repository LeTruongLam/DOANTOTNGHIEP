import TextField from "@mui/material/TextField";

export default function CourseTitle({ courseTitle, setCourseTitle }) {
  return (
    <div className="course-title stepper-content">
      <div className="course-title-wrapper">
        <div className="course-title-header  mt-3 mb-3">
          <p>Tiêu đề môn học</p>
        </div>
        <div className="course-title-body">
          <div className="grid">
            <TextField
              value={courseTitle}
              className="bg-main"
              onChange={(e) => setCourseTitle(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
