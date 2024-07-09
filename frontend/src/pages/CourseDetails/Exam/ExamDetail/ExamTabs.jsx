import { Undo2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function ExamTabs({
  time,
  setTime,
  questions,
  activeTab,
  flaggedQuestions,
  handleTabClick,
  answers,
  onShowDialog,
  handleFormSubmit,
  courseTitle,
  examTitle,
}) {
  const navigate = useNavigate();
  const { examId, courseId } = useParams();

  const generateTabs = () => {
    return questions?.map((question, index) => {
      const answered = answers.find(
        (answer) => answer.questionId === question.QuestionId
      );
      return (
        <li
          key={index}
          className={`rounded-md border border-blue-500 text-black flex ${
            answered && "bg-green-700 text-white border-slate-200"
          } ${activeTab === index + 1 && "bg-blue-600 text-white"}`}
        >
          <span
            className="inline-flex items-center justify-center flex-grow px-1 py-2 rounded-md  hover:outline-blue-600 hover:outline"
            onClick={() => handleTabClick(question.QuestionId, index)}
          >
            {flaggedQuestions.includes(question.QuestionId) && <span>🚩</span>}
            {(index + 1).toString()}
          </span>
        </li>
      );
    });
  };

  return (
    <div className="w-[20%]">
      <div className="sticky top-16">
        <div className="sticky mb-4 isolate flex flex-col items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <div className="flex w-full">
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:cursor-pointer opacity-85 hover:opacity-100 rounded-md">
              <Undo2 className="w-5 h-5" />
              <span
                className="text-gray-900 text-sm font-medium opacity-85"
                onClick={() => {
                  navigate(`/course/${courseId}/exams/${examId}/overview`);
                }}
              >
                Quay lại
              </span>
            </div>
          </div>
          <div
            className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>
          <div
            className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm leading-6 text-gray-900">
              <strong className="font-semibold">{courseTitle}</strong>
              <p className="font-semibold"> {examTitle}</p>
            </p>
            <div className="flex justify-between items-center w-full">
              <a
                onClick={onShowDialog}
                className="flex-none rounded-full hover:cursor-pointer bg-blue-600 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:text-white"
              >
                Nộp bài <span aria-hidden="true">&rarr;</span>
              </a>
              <p className="bg-blue-600 text-white font-semibold px-3.5 py-1 text-sm rounded-full">
                <span>
                  {Math.floor(time / 60)
                    .toString()
                    .padStart(2, "0")}
                  {" : "}
                  {(time % 60).toString().padStart(2, "0")}
                </span>
              </p>
            </div>
          </div>
        </div>
        <ul className="grid max-h-[400px] overflow-auto overscroll-y-auto border mb-6 rounded-md border-blue-500 py-3 px-4 grid-cols-5 gap-2 text-sm font-medium text-center text-gray-500">
          {generateTabs()}
        </ul>
      </div>
    </div>
  );
}

export default ExamTabs;
