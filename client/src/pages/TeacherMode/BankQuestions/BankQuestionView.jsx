import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import React, { Fragment, useContext, useState, useEffect } from "react";
import StepperFirst from "./StepperAdd/ListQuestions";
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
  const [questionType, setQuestionType] = useState("single");
  const [questionImg, setQuestionImg] = useState();
  const [optionsAnswer, setOptionsAnswer] = useState([]);
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
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setQuestions([]);
      handleClose();
      setActiveStep(0);
    } else {
      const newQuestion = {
        questionTitle: questionTitle,
        questionType: questionType,
        questionImg: questionImg,
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
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setQuestions([])
  };
  return (
    <>
      <div className="flex justify-between items-center px-6 mt-3 border-b border-slate-300 pb-3">
        <span className="text-xl font-bold">{course?.title}</span>
        <button
          onClick={handleClickOpen}
          type="submit"
          className="flex-none rounded-md hover:bg-blue-500 bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <AddCircleOutlineIcon className="mr-1" />
          Bank Question
        </button>
      </div>
      <div className="rounded-b-lg" style={{ backgroundColor: "#F5F5F5" }}>
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
              <ListItemButton>
                <div className="flex justify-between w-full items-center">
                  <div className="flex items-center">
                    {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                    <ListItemText
                      className="ml-3"
                      primary={`Chương ${index + 1}: ${item.ChapterTitle}`}
                    />
                  </div>
                  <div
                    onClick={handleClickOpen}
                    className=" border rounded-md px-2 py-1 flex items-center gap-1		"
                  >
                    <AddIcon />
                    <span>Quiz</span>
                  </div>
                </div>
              </ListItemButton>
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
                    <StepperFirst
                      setQuestions={setQuestions}
                      questions={questions}
                      setOptionsAnswer={setOptionsAnswer}
                      optionsAnswer={optionsAnswer}
                      setQuestionType={setQuestionType}
                      questionType={questionType}
                      setQuestionTitle={setQuestionTitle}
                      questionTitle={questionTitle}
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
                disabled={activeStep === 0}
                onClick={handleBack}
                type="button"
                class="cursor-pointer text-black bg-white border border-blue-500 focus:outline-none hover:bg-slate-100  font-medium rounded-md text-sm px-5 py-1.5 me-2 mb-2  "
              >
                Back
              </button>
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
