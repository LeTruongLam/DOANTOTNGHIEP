/* eslint-disable jsx-a11y/img-redundant-alt */
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import React, { useState, Fragment, useEffect, useRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { message } from "antd";
import ShowDialog from "../../../../components/Dialogs/ShowDialog";
import Spinner from "../../../../components/Spinners/Spinner";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const choice = ["Single Choice", "Multiple Choice", "Text Input"];
function QuestionFormEdit({
  setOpen,
  open,
  questionType,
  setQuestionType,
  optionsAnswer,
  setOptionsAnswer,
  onFileChange,
  setIsLoading,
  isLoading,
  questionId,
}) {
  const [selectedType, setSelectedType] = useState();
  const [questionContent, setQuestionContent] = useState("");
  const [questionImg, setQuestionImg] = useState("");
  const [questionOptions, setQuestionOptions] = useState([]);
  const [newOptionValue, setNewOptionValue] = useState("");
  const [optionImg, setOptionImg] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const [onShowDialog, setOnShowDialog] = useState(false);
  const wrapperRef = useRef(null);
  const [question, setQuestion] = useState();
  const [changeOption, setChangeOption] = useState({
    id: "",
    optionTitle: "",
    optionImg: "",
    isAnswer: false,
  });
  const fetchQuestionById = async () => {
    const token = localStorage.getItem("token");
    try {
      if (questionId) {
        const res = await axios.get(`http://localhost:8800/api/questions/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        const data = res.data;
        setQuestion(data);
        setSelectedType(data.QuestionType);
        setQuestionContent(data.QuestionContent);
        setQuestionImg(data.QuestionImg);
        setQuestionOptions(data.QuestionOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchQuestionById();
  }, [questionId]);
  const handleChangeOptionImg = async (e) => {
    const newFile = e.target.files[0];
    const data = await onFileChange(newFile);
    setOptionImg(data.imageUrl);
  };

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
  const onDrop = () => wrapperRef.current.classList.remove("dragover");
  const onFileDrop = async (e) => {
    const newFile = e.target.files[0];
    setIsLoading(true);
    const data = await onFileChange(newFile);
    setQuestionImg(data.imageUrl);
  };
  const handleQuestionContentChange = (event) => {
    setQuestionContent(event.target.value);
  };
  const handleAddOption = () => {
    const newOption = {
      id: questionOptions.length + 1,
      isAnswer: isAnswer,
      optionImg: optionImg,
      optionTitle: newOptionValue,
    };
    if (selectedType === "Single Choice") {
      const check = validateSingleChoiceOptions(questionOptions);
      if (check === 1 && isAnswer) {
        message.warning("Single choice questions have only 1 answer!");
      } else {
        setQuestionOptions([...questionOptions, newOption]);
        setNewOptionValue("");
        setOptionImg("");
      }
    } else {
      setQuestionOptions([...questionOptions, newOption]);
      setNewOptionValue("");
      setOptionImg("");
    }
  };
  const handleQuestionTypeChange = (value) => {
    setQuestionType(value);
  };

  const handleNewOptionValueChange = (event) => {
    setNewOptionValue(event.target.value);
  };
  const validateSingleChoiceOptions = (options) => {
    let hasTrueIsAnswer = false;
    options.forEach((option, index) => {
      if (option?.isAnswer === true) {
        hasTrueIsAnswer = true;
      }
    });

    return hasTrueIsAnswer ? 1 : 0;
  };

  const handleDeleteOption = (optionId) => {
    const updatedOptionsAnswer = optionsAnswer.filter(
      (option) => option.id !== optionId
    );
    setOptionsAnswer(updatedOptionsAnswer);
  };
  const handleDeleteQuestionOptions = (optionId) => {
    const updatedOptionsAnswer = questionOptions.filter(
      (option) => option.id !== optionId
    );
    setQuestionOptions(updatedOptionsAnswer);
  };

  const renderOptions = () => {
    return optionsAnswer.map((option) => {
      const inputId =
        questionType === "Single Choice"
          ? `bordered-radio-${option?.id}`
          : `bordered-checkbox-${option?.id}`;
      const inputType = questionType === "Single Choice" ? "radio" : "checkbox";
      return (
        <div
          key={option?.id}
          className=" flex my-3 border border-blue-300 items-center px-3 rounded-md bg-white"
        >
          {option?.optionImg && (
            <img
              className="h-10 w-12 border object-fill border-slate-200 m-1 image-zoom hover:rounded-sm hover:shadow-lg hover:border-none hover:shadow-gray-100	"
              src={option?.optionImg}
              alt="Image option"
            />
          )}

          <label
            htmlFor={inputId}
            className="w-full py-3 ms-2 text-sm font-medium opacity-80 text-gray-900 truncate"
          >
            {option.optionTitle}
          </label>
          <input
            id={inputId}
            type={inputType}
            value={option.isAnswer}
            name={
              questionType === "single" ? "bordered-radio" : "bordered-checkbox"
            }
            className="w-5 h-5 text-blue-600"
            checked={option.isAnswer}
          />
          <button
            // onClick={() => handleDeleteOption(option.id)}
            className="ml-2 text-sm font-medium text-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteOption(option.id)}
            className="ml-2 text-sm font-medium text-red-600"
          >
            Delete
          </button>
        </div>
      );
    });
  };
  const [editingOptionId, setEditingOptionId] = useState(null);

  const handleEditClick = (option, optionId) => {
    setChangeOption(option);
    setEditingOptionId(optionId);
  };

  const handleSaveChangeOptionClick = (optionId) => {
    const newOptions = questionOptions.map((option) => {
      if (option.id === optionId) {
        return {
          ...option,
          optionImg: changeOption.optionImg,
          isAnswer: changeOption.isAnswer,
          optionTitle: changeOption.optionTitle,
        };
      }
      return option;
    });
    setQuestionOptions(newOptions);
    setEditingOptionId(null);
    setChangeOption({
      id: "",
      optionTitle: "",
      optionImg: "",
      isAnswer: false,
    });
  };
  const handleSubmitChangeQuestion = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:8800/api/questions/${questionId}`,
        {
          questionContent,
          questionType: selectedType,
          questionImg,
          questionOptions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Question updated successfully.");
      setOpen(false);
    } catch (error) {
      message.error("Error updating question.");
      console.log(error);
    }
  };
  return (
    <Dialog className="scroll " fullWidth sx={{ m: 1 }} open={open}>
      <div className="z-100000">
        <ShowDialog open={onShowDialog} setOpen={setOnShowDialog} />
      </div>
      <div className="form-wrapper mx-0 my-3 scroll">
        <DialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            padding: 0,
            margin: "0 20px 4px 20px",
          }}
        >
          Edit Question
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
          <div className="px-5 py-3 bg-slate-100 ">
            <div className="my-3">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Write your question here
                <span className="text-red-800 text-xl	">*</span>
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  value={questionContent}
                  onChange={handleQuestionContentChange}
                  rows={1}
                  className="w-full min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  placeholder="Enter  question "
                />
              </div>
            </div>
            <div className="my-3">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
              >
                Upload img
              </label>
              <div className="bg-white rounded-md flex items-center  	 ">
                <div className=" bg-slate-200 opacity-50 flex-6 m-4  rounded-md cursor-pointer hover:opacity-100">
                  <div
                    ref={wrapperRef}
                    className="flex justify-center items-center relative overflow-hidden"
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                  >
                    {isLoading && <Spinner />}
                    {questionImg ? (
                      <div className="max-h-40 max-w-60 py-0">
                        <img src={questionImg} alt="Question Image" />
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center py-10 items-center mx-6">
                        <CloudUploadIcon fontSize="medium" />
                        <p className="text-sm mt-1	">
                          <span className="text-purple-600	">Upload a img</span>
                          <span> or drag and drop </span>
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      value=""
                      className="absolute top-0 left-0 opacity-0 w-full h-full"
                      onChange={onFileDrop}
                    />
                  </div>
                </div>
                <div className="flex-4 flex-grow m-4">
                  <span className="text-sm">Maximum image file size: </span>
                  <span className="text-sm font-semibold">10MB </span>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="questionType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select your question type
              </label>
              <Listbox value={selectedType} onChange={setSelectedType}>
                {({ open }) => (
                  <div className="relative mt-2">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                      <span className="flex items-center">
                        <span className="ml-3 block truncate">
                          {selectedType}
                        </span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {choice.map((option, index) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={option}
                            onClick={() => {
                              handleQuestionTypeChange(option);
                            }}
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="flex items-center">
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "ml-3 block truncate"
                                    )}
                                  >
                                    {option}
                                  </span>
                                </div>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-indigo-600",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            </div>
            <div className="my-3">
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Input options for the question and select the correct{" "}
                <span className="text-red-800 text-xl	">*</span>
              </label>
              <div>
                {questionOptions &&
                  questionOptions.map((option) => {
                    const inputType =
                      questionType === "Single Choice" ? "radio" : "checkbox";
                    const isEditing = option.id === editingOptionId;
                    return (
                      <div
                        key={option?.id}
                        className="flex relative my-3 border border-blue-300 items-center px-3 rounded-md bg-white"
                      >
                        {isEditing ? (
                          // Giao diện chỉnh sửa
                          <div className="flex-grow w-full">
                            <div className="pt-3">
                              <textarea
                                rows={1}
                                className="min-h-10 w-full border flex-grow  border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                type="text"
                                value={changeOption.optionTitle}
                                onChange={(e) =>
                                  setChangeOption((prevState) => ({
                                    ...prevState,
                                    optionTitle: e.target.value,
                                  }))
                                }
                              />
                              <div className="flex justify-start items-center gap-4 py-2">
                                <div className="flex justify-center items-center gap-3 text-sm font-medium opacity-80 text-gray-900">
                                  <input
                                    type="radio"
                                    name="isAnswer"
                                    className="w-4 h-4"
                                    checked={changeOption.isAnswer}
                                    onChange={() => {
                                      setChangeOption((prevState) => ({
                                        ...prevState,
                                        isAnswer: true,
                                      }));
                                    }}
                                  />
                                  <div className="flex-shrink-0">
                                    <span className="w-full">Is Answer</span>
                                  </div>
                                </div>
                                <div className="flex justify-center items-center gap-3 text-sm font-medium opacity-80 text-gray-900">
                                  <input
                                    type="radio"
                                    name="isAnswer"
                                    className="w-4 h-4"
                                    checked={!changeOption.isAnswer}
                                    onChange={() => {
                                      setChangeOption((prevState) => ({
                                        ...prevState,
                                        isAnswer: false,
                                      }));
                                    }}
                                  />
                                  <div className="flex-shrink-0">
                                    <span className="w-full">
                                      Is Not Answer
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-start items-center  py-2  gap-3">
                                <div className="relative">
                                  <input
                                    type="file"
                                    value=""
                                    className="absolute top-0 left-0 opacity-0 w-full h-full"
                                    onChange={async (e) => {
                                      const newFile = e.target.files[0];
                                      const data = await onFileChange(newFile);
                                      setChangeOption((prevState) => ({
                                        ...prevState,
                                        optionImg: data.imageUrl,
                                      }));
                                    }}
                                  />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#fff"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                    />
                                  </svg>
                                </div>
                                <a
                                  href={changeOption?.optionImg}
                                  title={changeOption?.optionImg}
                                  target="_blank"
                                  className="truncate w-full text-sm font-medium opacity-80 text-blue-700 hover:cursor-pointer underline"
                                >
                                  {changeOption?.optionImg}
                                </a>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <button
                                class="text-red-600 bg-white  focus:outline-none hover:bg-slate-100  font-medium rounded-md text-sm px-3 py-1.5  mb-2  "
                                onClick={() => {
                                  setEditingOptionId(null);
                                }}
                              >
                                Cancle
                              </button>
                              <button
                                class="text-white border-blue-500 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-1.5  mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                onClick={() => {
                                  handleSaveChangeOptionClick(option.id);
                                }}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Giao diện hiển thị thông tin
                          <>
                            {option?.optionImg && (
                              <img
                                className="h-10 w-12 border object-fill border-slate-200 m-1 image-zoom hover:rounded-sm hover:shadow-lg hover:border-none hover:shadow-gray-100"
                                src={option?.optionImg}
                                alt="Image option"
                              />
                            )}
                            <label
                              htmlFor={option?.id}
                              className="w-full py-3 ms-2 text-sm font-medium opacity-80 text-gray-900 truncate"
                            >
                              {option.optionTitle}
                            </label>
                            <input
                              id={option?.id}
                              type={inputType}
                              value={option.isAnswer}
                              name={
                                questionType === "Single Choice"
                                  ? "bordered-radio"
                                  : "bordered-checkbox"
                              }
                              className="w-5 h-5 text-blue-600"
                              checked={option.isAnswer}
                            />
                            <button
                              className="ml-2 text-sm font-medium text-blue-600"
                              onClick={() => {
                                handleEditClick(option, option.id);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteQuestionOptions(option.id)
                              }
                              className="ml-2 text-sm font-medium text-red-600"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                {renderOptions()}
                <div className="flex justify-between w-full items-center gap-3 ">
                  <div className="flex justify-center items-center gap-2 flex-grow">
                    <textarea
                      type="text"
                      rows={1}
                      value={newOptionValue}
                      onChange={handleNewOptionValueChange}
                      className="min-h-10 border flex-grow  border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      placeholder="Enter option content"
                    />

                    {questionType !== "Text Input" && (
                      <>
                        <input
                          id="isAnswer"
                          type="checkbox"
                          value={isAnswer}
                          name={"bordered-radio"}
                          className="w-5 h-5 text-blue-600 "
                          onChange={() => {
                            setIsAnswer(!isAnswer);
                          }}
                        />
                        <div className="relative">
                          <input
                            type="file"
                            value=""
                            className="absolute top-0 left-0 opacity-0 w-full h-full"
                            onChange={handleChangeOptionImg}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#fff"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleAddOption}
                    className="flex items-center hover:bg-slate-200 px-2 py-1 rounded-md justify-center gap-1 text-sm font-medium text-blue-600"
                  >
                    <AddIcon style={{ color: "rgb(37 99 235)" }} />
                    <span>Add An Option</span>
                  </button>
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
              onClick={() => {
                handleSubmitChangeQuestion();
                setOnShowDialog(true);
              }}
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

export default QuestionFormEdit;
