/* eslint-disable jsx-a11y/img-redundant-alt */
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  generateAccessCode,
  formattedDateTime,
} from "../../../../js/TAROHelper";
import React, { useState, Fragment, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import QuestionsList from "./QuestionsList";
import { message } from "antd";
import axios from "axios";
function ExamForm({ open, setOpen, chapters }) {
  const { courseId } = useParams();
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [timeLimit, setTimeLimit] = useState(0);
  const [questionList, setQuestionList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [checkedClasses, setCheckedClasses] = useState([]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/api/classes/${courseId}`);
      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [courseId]);

  const handleCheckboxChange = (classId) => {
    if (checkedClasses.includes(classId)) {
      setCheckedClasses(checkedClasses.filter((id) => id !== classId));
    } else {
      setCheckedClasses([...checkedClasses, classId]);
    }
  };

  const renderQuestionCount = () => {
    const filteredQuestionList = questionList.filter(Boolean);
    const mergedQuestionList = filteredQuestionList.flat();
    const questionCount = mergedQuestionList.length;

    return (
      <div>
        <p className="font-semibold text-base text-blue-700">{questionCount}</p>
      </div>
    );
  };
  const handleSave = async () => {
    const filteredQuestionList = questionList.filter(Boolean);
    const mergedQuestionList = filteredQuestionList.flat();

    const validateForm = () => {
      if (examTitle.trim() === "") {
        message.error("Exam title cannot be empty.");
        return false;
      }
      if (mergedQuestionList.length === 0) {
        message.error("Questions is empty.");
        return false;
      }
      if (showInput && accessCode.trim() === "") {
        message.error("Access code cannot be empty.");
        return false;
      }
      return true;
    };

    const createExam = async () => {
      const formatStartTime = formattedDateTime(startTime);
      try {
        const payload = {
          courseId: courseId,
          examTitle: examTitle,
          examDescription: examDescription,
          startTime: formatStartTime,
          timeLimit: timeLimit,
          questions: mergedQuestionList,
          confirmAccess: showInput,
          accessCode: accessCode,
          classes: checkedClasses,
        };
        const response = await axios.post(
          `http://localhost:8800/api/questions/exam/${courseId}`,
          payload
        );
        message.success("Exam created successfully");
        setOpen(false);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    if (validateForm()) {
      await createExam();
    }
  };

  const handlegenerateAccessCode = () => {
    const newAccessCode = generateAccessCode();
    setAccessCode(newAccessCode);
  };
  const handleCheckboxAccessChange = (event) => {
    setShowInput(event.target.checked);

    if (!event.target.checked) {
      setAccessCode("");
    }
  };

  const handleAccessCodeChange = (event) => {
    setAccessCode(event.target.value);
  };
  return (
    <Dialog fullWidth sx={{ m: 1 }} open={open}>
      <div className="form-wrapper mx-0 my-3 ">
        <DialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            padding: 0,
            margin: "0 20px 4px 20px",
          }}
        >
          Exam
          <Button
            onClick={() => {
              setOpen(false);
            }}
            style={{ marginLeft: "auto", justifyContent: "flex-end" }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <div>
          <div className="px-5 py-3 flex flex-1 gap-5 bg-slate-100 ">
            <div>
              <div className="my-3">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Write exam title
                  <span className="text-red-800 text-xl	">*</span>
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    rows={1}
                    className="w-full min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    placeholder="Enter  title "
                  />
                </div>
              </div>
              <div className="my-3">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Exam description test
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={1}
                    value={examDescription}
                    onChange={(e) => setExamDescription(e.target.value)}
                    className="w-full min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    placeholder="Enter  description "
                  />
                </div>
              </div>
              <div className="my-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DateTimePicker", "MobileDateTimePicker"]}
                  >
                    <DemoItem label="Start time">
                      <MobileDateTimePicker
                        value={startTime}
                        onChange={(date) => setStartTime(date)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div className="my-3">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Time limit
                </label>
                <div className="mt-2 flex items-center justify-start gap-3">
                  <input
                    type="number"
                    min="0"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    className="max-w-20 min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 text-center"
                  />
                  <span className="bg-white font-semibold text-gray-700 w-max min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                    Minutes
                  </span>
                  <div>
                    <span className="text-gray-900 opacity-90 font-semibold text-sm">
                      Time limit for this quiz. 0 means no time limit.
                    </span>
                  </div>
                </div>
              </div>

              <div className="my-3 flex justify-between items-center">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Number of questions
                </label>
                <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {renderQuestionCount()}
                </span>
              </div>
              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Applicable subjects
                </label>
                <div className="my-3 px-3 py-2 rounded-md bg-white">
                  <div className="pb-3 border-b border-slate-300 flex justify-between items-center    ">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      checked={checkedClasses.length === classes.length}
                      onChange={() => {
                        if (checkedClasses.length === classes.length) {
                          setCheckedClasses([]);
                        } else {
                          setCheckedClasses(
                            classes.map((classItem) => classItem.ClassId)
                          );
                        }
                      }}
                    />
                    <label className=" text-sm font-medium text-gray-900">
                      <span>Select all</span>
                    </label>
                  </div>

                  {classes.map((classItem) => (
                    <div
                      key={classItem.ClassId}
                      className="flex justify-between items-center py-3"
                    >
                      <input
                        type="checkbox"
                        value=""
                        checked={checkedClasses.includes(classItem.ClassId)}
                        onChange={() => handleCheckboxChange(classItem.ClassId)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ms-2 text-sm font-medium text-gray-900">
                        <span>
                          {classItem.ClassCode} - {classItem.title}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="my-3 flex flex-col">
                <div className=" flex justify-between items-center">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Use the access code
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      onChange={handleCheckboxAccessChange}
                    />
                    <div className="relative w-11 h-6 bg-zinc-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {showInput && (
                  <div className="relative mt-3">
                    <input
                      type="text"
                      value={accessCode}
                      onChange={handleAccessCodeChange}
                      placeholder="Enter access code"
                      className="w-full min-h-10  border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    />
                    <button
                      className="absolute top-0 right-0 h-full opacity-50 px-4 hover:opacity-100 "
                      title="Generate Access Code"
                      onClick={handlegenerateAccessCode}
                    >
                      <AutoAwesomeIcon color="primary" fontSize="small" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="my-3 ">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Questions
                </label>
                <div className="mt-2">
                  <div className="bg-white  rounded-md">
                    <div className="px-3">
                      <QuestionsList
                        chapters={chapters}
                        setQuestionList={setQuestionList}
                        questionList={questionList}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mx-5 mt-4 ">
          <button
            type="button"
            class="text-black bg-white border border-blue-500 focus:outline-none hover:bg-slate-100  font-medium rounded-md text-sm px-5 py-1.5 me-2 mb-2  "
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              type="button"
              class="text-white border-blue-500 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-1.5  mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ExamForm;
