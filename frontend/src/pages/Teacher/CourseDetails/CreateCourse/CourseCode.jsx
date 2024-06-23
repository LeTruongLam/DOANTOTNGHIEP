import TextField from "@mui/material/TextField";
export default function CourseCode({ courseCode, setCourseCode }) {
  return (
    <div className="course-title stepper-content">
      <div className="course-title-wrapper">
        <div className="course-title-header  mt-3 mb-3">
          <p>Mã môn học</p>
        </div>
        <div className="course-title-body">
          <div className="grid">
            <TextField
              value={courseCode}
              className="bg-main"
              onChange={(e) => setCourseCode(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
