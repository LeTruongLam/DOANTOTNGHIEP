import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import React, { Fragment, useContext, useState, useEffect } from "react";
import ListQuestions from "./QuestionFormAdd/ListQuestions";
import QuestionsInfo from "./QuestionFormAdd/QuestionsInfo";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import { formatDateString } from "../../../js/TAROHelper";
import { message } from "antd";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import ClassMenu from "../../../components/SelectMenus/ClassMenu";
import QuestionFormEdit from "./QuestionFormEdit/QuestionFormEdit";
import SpeedDialTooltipOpen from "./Components/SpeedDial";
import ExamForm from "./ExamForm/ExamForm";
const steps = ["Add Question", "Questions Info"];

function BankQuestionView() {
  const [course, setCourse] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [openExam, setOpenExam] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { courseId } = useParams();
  const { fetchChapter, fetchCourseById } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionType, setQuestionType] = useState("Single Choice");
  const [questionImg, setQuestionImg] = useState();
  const [chapterId, setChapterId] = useState();
  const [optionsAnswer, setOptionsAnswer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selected, setSelected] = useState();
  const [questionId, setQuestionId] = useState(null);
  const handleReloadClick = () => {
    window.location.reload();
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
    setSelectedIds([]);
  }, [chapterId]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const uploadImgFileToCloudinary = async (imgFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imgFile);
      const response = await axios.post("/users/questions/uploadImg", formData);
      setIsLoading(false); // Đặt setIsLoading(false) ở đây, sau khi nhận được response thành công
      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Đặt setIsLoading(false) ở đây, sau khi xảy ra lỗi
      throw error;
    }
  };
  const handleSubmitQuestions = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `/questions/course/${courseId}`,
        { questions, chapterId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      message.success("Questions added successfully.");
      fetchQuestionListByChapterId();
    } catch (error) {
      message.error("Question added error");

      console.log(error);
    }
  };
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmitQuestions();
      setQuestions([]);
      setQuestionImg();
      handleClose();
      setActiveStep(0);
    } else {
      if (!questionTitle) {
        message.error("Question title cannot be empty");
        return;
      }
      const newQuestion = {
        id: questions.length + 1,
        questionTitle: questionTitle,
        questionType: questionType,
        questionImg: questionImg,
        answerText: "",
        optionsAnswer: optionsAnswer,
      };
      setQuestions([...questions, newQuestion]);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    setQuestionTitle("");
    setOptionsAnswer([]);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setQuestionType("Single Choice");
    setQuestionImg();
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setQuestions([]);
  };

  const fetchQuestionListByChapterId = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`/questions/chapters/${chapterId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      setQuestionData(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchQuestionListByChapterId();
  }, [chapterId]);

  const handleCheckboxChange = (event) => {
    const id = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Thêm id vào mảng selectedIds
      setSelectedIds([...selectedIds, id]);
    } else {
      // Xóa id khỏi mảng selectedIds
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };
  const handleDeleteQuestion = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/questions/chapters/${chapterId}`, {
        data: { selectedIds }, // Pass selectedIds as the request body
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      message.success("Questions deleted successfully.");
      setSelectedIds([]);
      fetchQuestionListByChapterId();
    } catch (error) {
      message.error("Error deleting questions.");
      console.log(error);
    }
  };
  return (
    <>
      {openEdit && (
        <QuestionFormEdit
          open={openEdit}
          setOpen={setOpenEdit}
          setQuestions={setQuestions}
          questions={questions}
          setOptionsAnswer={setOptionsAnswer}
          optionsAnswer={optionsAnswer}
          setQuestionType={setQuestionType}
          questionType={questionType}
          setQuestionTitle={setQuestionTitle}
          questionTitle={questionTitle}
          setQuestionImg={setQuestionImg}
          questionImg={questionImg}
          onFileChange={uploadImgFileToCloudinary}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          questionId={questionId}
        />
      )}
      <SpeedDialTooltipOpen />
      {openExam && <ExamForm open={openExam} setOpen={setOpenExam} />}
      <div className="flex justify-between items-center px-3 mt-3 border-b border-slate-300 pb-3">
        <span className="text-xl font-bold">{course?.title}</span>
        <button
          onClick={() => {
            setOpenExam(true);
          }}
          type="submit"
          className="flex-none rounded-md hover:bg-blue-500 bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <AddCircleOutlineIcon className="mr-1" />
          Exam
        </button>
      </div>
      <div
        className="rounded-b-lg min-h-[600px]"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <div className="p-3 pb-0 flex justify-between items-center ">
          <div className=" flex justify-center items-center">
            <div
              onClick={handleReloadClick}
              className="hover:bg-slate-200 hover:rounded-md px-1 hover:cursor-pointer"
            >
              <RefreshIcon />
            </div>
            <span className="mx-2 text-slate-500">|</span>
            <span className=" ">{selectedIds.length} questions selected</span>
            {selectedIds.length !== 0 && (
              <span className="ml-4 px-3 py-2 hover:bg-slate-200  hover:cursor-pointer hover:rounded-md text-blue-700 text-sm">
                Clean
              </span>
            )}
          </div>
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
                onClick={() => handleClickOpen()}
                className="bg-blue-700 text-sm rounded-md font-semibold text-white py-2 px-3"
              >
                Add Question
              </button>
            ) : (
              <div
                onClick={handleDeleteQuestion}
                className="flex justify-center items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:rounded-md hover:cursor-pointer"
              >
                <DeleteIcon
                  style={{ color: "rgb(220 38 38)", fontSize: "20px" }}
                />
                <span className="text-red-600 text-sm font-semibold">
                  Delete
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="p-3">
          <div class="  shadow-sm sm:rounded-lg p-4 bg-white ">
            <div className="min-h-[480px] max-h-[500px] overflow-y-auto">
              <table class="w-full  text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-sm text-black font-normal">
                  <tr>
                    <th scope="col" class="p-4"></th>
                    <th scope="col" class="px-6 py-2" style={{ width: "30%" }}>
                      Question Content
                    </th>
                    <th scope="col" class="px-6 py-2" style={{ width: "20%" }}>
                      Question ID
                    </th>
                    <th scope="col" class="px-6 py-2" style={{ width: "20%" }}>
                      Question Type
                    </th>
                    <th scope="col" class="px-6 py-2" style={{ width: "20%" }}>
                      Created At
                    </th>
                    <th scope="col" class="px-6 py-2" style={{ width: "10%" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {questionData.map((question) => (
                    <tr
                      key={question.QuestionId}
                      class="bg-white border-t border-slate-300 hover:bg-zinc-100"
                    >
                      <td class="w-4 p-3">
                        <div class="flex items-center">
                          <input
                            id={question.QuestionId}
                            onChange={handleCheckboxChange}
                            type="checkbox"
                            className={` w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                            value={question.QuestionId}
                          />
                        </div>
                      </td>
                      <td class="px-6 py-3 max-w-96 truncate ">
                        <span title={question.QuestionContent}>
                          {question.QuestionContent}
                        </span>
                      </td>
                      <td class="px-6 py-3 truncate ...">
                        {question.QuestionId}
                      </td>
                      <td class="px-6 py-3">{question.QuestionType}</td>
                      <td className="px-6 py-2 truncate ">
                        {formatDateString(question.LastModificationTime)}
                      </td>
                      <td class="px-6 py-3">
                        <button
                          onClick={() => {
                            setOpenEdit(true);
                            // fetchQuestionById(question.QuestionId);
                            setQuestionId(question.QuestionId);
                          }}
                          class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        className="scroll "
        fullWidth
        sx={{ m: 1 }}
        onClose={handleClose}
        open={open}
      >
        <div className="form-wrapper mx-0 my-3 scroll">
          <DialogTitle
            style={{
              display: "flex",
              alignItems: "center",
              padding: 0,
              margin: "0 20px 4px 20px",
            }}
          >
            Quiz
            <Button style={{ marginLeft: "auto", justifyContent: "flex-end" }}>
              <CloseIcon onClick={handleClose} />
            </Button>
          </DialogTitle>
          <div>
            <Box sx={{ width: "100%" }}>
              <Stepper className="mx-3" activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>

              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  {activeStep === 1 && (
                    <ListQuestions
                      setQuestions={setQuestions}
                      questions={questions}
                      handleBack={handleBack}
                    />
                  )}
                  {activeStep === 0 && (
                    <QuestionsInfo
                      setQuestions={setQuestions}
                      questions={questions}
                      setOptionsAnswer={setOptionsAnswer}
                      optionsAnswer={optionsAnswer}
                      setQuestionType={setQuestionType}
                      questionType={questionType}
                      setQuestionTitle={setQuestionTitle}
                      questionTitle={questionTitle}
                      setQuestionImg={setQuestionImg}
                      questionImg={questionImg}
                      onFileChange={uploadImgFileToCloudinary}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  )}
                </Typography>
              </React.Fragment>
            </Box>
          </div>

          <div className="flex justify-between items-center mx-5 mt-4 ">
            <button
              onClick={handleClose}
              type="button"
              class="text-black bg-white border border-blue-500 focus:outline-none hover:bg-slate-100  font-medium rounded-md text-sm px-5 py-1.5 me-2 mb-2  "
            >
              Cancel
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleNext}
                type="button"
                class="text-white border-blue-500 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-1.5  mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {activeStep === steps.length - 1 ? "Done" : "Save & Next "}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default BankQuestionView;
