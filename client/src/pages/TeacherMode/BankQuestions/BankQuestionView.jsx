import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import React, { Fragment, useContext, useState, useEffect } from "react";
import ListQuestions from "./StepperAdd/ListQuestions";
import QuestionsInfo from "./StepperAdd/QuestionsInfo";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { message } from "antd";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import ComponentTest from "../../../components/SelectMenus/ComponentTest";
const steps = ["Add Question", "Questions Info"];

function BankQuestionView() {
  const [course, setCourse] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const { courseId } = useParams();
  const { fetchChapter, chapters, fetchCourseById } = useContext(AuthContext);
  const [openIndex, setOpenIndex] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionType, setQuestionType] = useState("Single Choice");
  const [questionImg, setQuestionImg] = useState();
  const [chapterId, setChapterId] = useState();
  const [optionsAnswer, setOptionsAnswer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    fetchChapter(courseId);
    const fetchData = async () => {
      try {
        let res = await fetchCourseById(courseId);
        setCourse(res);
      } catch (error) {}
    };
    fetchData();
  }, []);
  const handleClickOpen = (classId) => {
    setChapterId(classId);
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
      fetchQuestionListByChapterId(chapterId);
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
    setChapterId();
  };

  const fetchQuestionListByChapterId = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`/questions/chapters/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      setQuestionData(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickQuestionList = async (index, id) => {
    fetchQuestionListByChapterId(id);
    setOpenIndex((prevOpenIndex) => (prevOpenIndex === index ? null : index));
  };
  return (
    <>
      <div className="flex justify-between items-center px-6 mt-3 border-b border-slate-300 pb-3">
        <span className="text-xl font-bold">{course?.title}</span>
        <button
          // onClick={handleClickOpen}
          type="submit"
          className="flex-none rounded-md hover:bg-blue-500 bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <AddCircleOutlineIcon className="mr-1" />
          Bank Question
        </button>
      </div>
      <div className="rounded-b-lg" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="p-5 pb-0 flex justify-between items-center ">
          <div className=" flex justify-center items-center">
            <div className="hover:bg-slate-200 hover:rounded-md px-1 hover:cursor-pointer">
              <RefreshIcon />
            </div>
            <span className="mx-2 text-slate-500">|</span>
            <span className=" ">2 questions selected</span>
            <span className="ml-4 px-3 py-2 hover:bg-slate-200  hover:cursor-pointer hover:rounded-md text-blue-700 text-sm">
              Clean
            </span>
          </div>
          <div className="flex justify-between items-center gap-3">
            <div>
              <ComponentTest />
            </div>
            <div className="flex justify-center items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:rounded-md hover:cursor-pointer">
              <DeleteIcon
                style={{ color: "rgb(220 38 38)", fontSize: "20px" }}
              />
              <span className="text-red-600">Delete</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          {chapters.map((item, index) => (
            <List
              key={index}
              sx={{
                borderRadius: "12px",
                marginBottom: "16px",
                width: "100%",
                bgcolor: "#fff",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <ListItemButton
                onClick={() => handleClickQuestionList(index, item?.ChapterId)}
              >
                <div className="flex justify-between w-full items-center">
                  <div className="flex items-center">
                    {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                    <ListItemText
                      className="ml-3"
                      primary={`Chương ${index + 1}: ${item.ChapterTitle}`}
                    />
                  </div>
                  <div
                    onClick={() => handleClickOpen(item?.ChapterId)}
                    className=" border rounded-md px-2 py-1 flex items-center gap-1		"
                  >
                    <AddIcon />
                    <span>Quiz</span>
                  </div>
                </div>
              </ListItemButton>
              <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {questionData.map((item, id) => (
                    <ListItemButton key={id} sx={{ pl: 4 }}>
                      <ListItemText
                        primary={` Question ${id + 1}:  ${
                          item.QuestionContent
                        }`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </List>
          ))}
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
