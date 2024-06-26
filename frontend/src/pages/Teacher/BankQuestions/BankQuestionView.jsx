import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import React, {  useContext, useState, useEffect } from "react";
import ListQuestions from "./QuestionFormAdd/ListQuestions";
import QuestionsInfo from "./QuestionFormAdd/QuestionsInfo";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import { formatDateString } from "@/js/TAROHelper";
import { message } from "antd";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import ClassMenu from "@/components/SelectMenus/ClassMenu";
import QuestionFormEdit from "./QuestionFormEdit/QuestionFormEdit";
import SpeedDialTooltipOpen from "./Components/SpeedDial";
import ExamForm from "./ExamForm/ExamForm";
import { Plus } from "lucide-react";
const steps = ["Thêm câu hỏi", "Danh sách câu hỏi"];

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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const uploadImgFileToCloudinary = async (imgFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imgFile);
      const response = await axios.post(
        "http://localhost:8800/api/users/questions/uploadImg",
        formData
      );
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
        `http://localhost:8800/api/questions/course/${courseId}`,
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
      const res = await axios.get(
        `http://localhost:8800/api/questions/chapters/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      setQuestionData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchQuestionListByChapterId();

    // Clean-up function
    return () => {
      setQuestionData([]); // Reset the questionData state to an initial value
    };
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
      await axios.delete(
        `http://localhost:8800/api/questions/chapters/${chapterId}`,
        {
          data: { selectedIds }, // Pass selectedIds as the request body
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
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
      {openExam && (
        <ExamForm open={openExam} setOpen={setOpenExam} chapters={chapters} />
      )}
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
          Thêm bài thi
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
            <span className=" ">Đã chọn {selectedIds.length} mục </span>
            {selectedIds.length !== 0 && (
              <span className="ml-4 px-3 py-2 hover:bg-slate-200  hover:cursor-pointer hover:rounded-md text-blue-700 text-sm">
                Bỏ chọn
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
                Tạo câu hỏi
              </button>
            ) : (
              <div
                onClick={handleDeleteQuestion}
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
              {questionData && questionData.length > 0 ? (
                <table className="w-full  text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-sm text-black font-normal">
                    <tr>
                      <th scope="col" className="p-4"></th>
                      <th
                        scope="col"
                        className="px-6 py-2"
                        style={{ width: "30%" }}
                      >
                        Nội dung câu hỏi
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2"
                        style={{ width: "20%" }}
                      >
                        Id câu hỏi
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 flex justify-center items-center w-max"
                      >
                        Kiểu câu hỏi
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2"
                        style={{ width: "20%" }}
                      >
                        Tạo lúc
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2"
                        style={{ width: "10%" }}
                      >
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionData.map((question) => (
                      <tr
                        key={question.QuestionId}
                        className="bg-white border-t border-slate-300 hover:bg-zinc-100"
                      >
                        <td className="w-4 p-3">
                          <div className="flex items-center">
                            <input
                              id={question.QuestionId}
                              onChange={(event) =>
                                handleCheckboxChange(event, question)
                              }
                              type="checkbox"
                              className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                              value={question.QuestionId}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-3 max-w-96 truncate">
                          <span title={question.QuestionContent}>
                            {question.QuestionContent}
                          </span>
                        </td>
                        <td className="px-6 py-3 truncate ...">
                          {question.QuestionId}
                        </td>
                        <td className="px-6 py-3 flex justify-center items-center">
                          {question.QuestionType === "Single Choice" && (
                            <svg
                              width="24px"
                              height="24px"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#16A34A" // Thay đổi màu fill thành mã hex màu xanh lá cây (#00FF00)
                              className="bi bi-check2-circle"
                            >
                              <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                              <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                            </svg>
                          )}
                          {question.QuestionType === "Multiple Choice" && (
                            <svg
                              width="24px"
                              height="24px"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#16A34A"
                              class="bi bi-check2-square"
                            >
                              <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z" />
                              <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                            </svg>
                          )}
                          {question.QuestionType === "Text Input" && (
                            <svg
                              width="24px"
                              height="24px"
                              viewBox="0 0 24 24"
                              fill="#16A34A" // Thay đổi màu fill thành mã hex màu xanh lá cây (#00FF00)
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.95197 6.25C9.52211 6.24993 9.12024 6.24986 8.79192 6.29891C8.42102 6.35432 8.04 6.4853 7.73542 6.82371C7.44103 7.15082 7.3371 7.54061 7.29204 7.91294C7.24993 8.26096 7.24996 8.69238 7.25 9.17954L7.25 9.75C7.25 10.1642 7.58579 10.5 8 10.5C8.41421 10.5 8.75 10.1642 8.75 9.75V9.22222C8.75 8.67931 8.75129 8.34011 8.78118 8.09313C8.7952 7.97725 8.81273 7.91048 8.8269 7.87221C8.83885 7.83993 8.84739 7.83046 8.85023 7.82731L8.85104 7.82637C8.8524 7.82473 8.8534 7.82353 8.86242 7.8194C8.87904 7.8118 8.92168 7.79617 9.01354 7.78245C9.21765 7.75196 9.50511 7.75 10 7.75H11.25V16.25H9.5C9.08579 16.25 8.75 16.5858 8.75 17C8.75 17.4142 9.08579 17.75 9.5 17.75H15C15.4142 17.75 15.75 17.4142 15.75 17C15.75 16.5858 15.4142 16.25 15 16.25H12.75V7.75H14C14.4949 7.75 14.7824 7.75196 14.9865 7.78245C15.0783 7.79617 15.121 7.8118 15.1376 7.8194C15.1466 7.82353 15.1476 7.82473 15.149 7.82637L15.1496 7.82716C15.1525 7.83031 15.1611 7.83993 15.1731 7.87221C15.1873 7.91048 15.2048 7.97725 15.2188 8.09313C15.2487 8.34011 15.25 8.67931 15.25 9.22222V9.75C15.25 10.1642 15.5858 10.5 16 10.5C16.4142 10.5 16.75 10.1642 16.75 9.75L16.75 9.17953C16.75 8.69238 16.7501 8.26096 16.708 7.91294C16.6629 7.54061 16.559 7.15082 16.2646 6.82371C15.96 6.4853 15.579 6.35432 15.2081 6.29891C14.8798 6.24986 14.4779 6.24993 14.048 6.25H9.95197Z"
                                fill="#16A34A"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25H11.9426ZM3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62178 2.75 12 2.75C14.3782 2.75 16.0864 2.75159 17.3864 2.92637C18.6648 3.09825 19.4355 3.42514 20.0052 3.9948C20.5749 4.56445 20.9018 5.33517 21.0736 6.61358C21.2484 7.91356 21.25 9.62178 21.25 12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62178 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62178 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948Z"
                                fill="#16A34A"
                              />
                            </svg>
                          )}
                        </td>
                        <td className="px-6 py-2 truncate">
                          {formatDateString(question.LastModificationTime)}
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => {
                              setOpenEdit(true);
                              setQuestionId(question.QuestionId);
                            }}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          >
                            Sửa
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
                          Không có câu hỏi nào
                        </h2>
                        <p className="text-center text-black text-base font-normal leading-relaxed pb-4">
                          Vui lòng cập nhật thêm câu hỏi
                        </p>
                        <div className="mx-auto w-full justify-center items-center inline-flex ">
                          <button
                            onClick={() => handleClickOpen()}
                            className=" flex  justify-center gap-2 items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 transition-all duration-500 rounded-full text-white text-xs font-semibold leading-4"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Câu hỏi mới</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
            Câu hỏi
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
              Hủy
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleNext}
                type="button"
                class="text-white border-blue-500 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-1.5  mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {activeStep === steps.length - 1 ? "Hoàn thành" : "Lưu & Tiép tục "}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default BankQuestionView;
