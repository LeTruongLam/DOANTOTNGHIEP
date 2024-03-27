/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { message } from "antd";
function QuestionsInfo({
  questions,
  setQuestions,
  questionTitle,
  setQuestionTitle,
  questionType,
  setQuestionType,
  optionsAnswer,
  setOptionsAnswer,
}) {
  const [options, setOptions] = useState([]);
  const [newOptionValue, setNewOptionValue] = useState("");
  const [optionImg, setOptionImg] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const wrapperRef = useRef(null);
  const handleChangeOptionImg = (e) => {
    const newFile = e.target.files[0];
    setOptionImg(newFile);
    // console.log(newFile);
  };

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
  const onDrop = () => wrapperRef.current.classList.remove("dragover");
  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    setSelectedFile(newFile);
  };
  const handleQuestionTitleChange = (event) => {
    setQuestionTitle(event.target.value);

  };
  const handleAddOption = () => {
    // const addOption = {
    //   id: options.length + 1,
    //   value: newOptionValue,
    //   isAnswer: isAnswer,

    // };
    const newOption = {
      id: optionsAnswer.length + 1,
      optionTitle: newOptionValue,
      optionImg: optionImg,
      isAnswer: isAnswer,
    };
    // setOptions([...options, addOption]);
    setOptionsAnswer([...optionsAnswer, newOption]);
    setNewOptionValue("");
    // console.log([...optionsAnswer, newOption]);
  };
  const handleQuestionTypeChange = (event) => {
    setQuestionType(event.target.value);
  };

  const handleNewOptionValueChange = (event) => {
    setNewOptionValue(event.target.value);
  };

  const handleDeleteOption = (optionId) => {
    const updatedOptionsAnswer = optionsAnswer.filter(
      (option) => option.id !== optionId
    );
    setOptionsAnswer(updatedOptionsAnswer);
  };

  const renderOptions = () => {
    return optionsAnswer.map((option) => {
      const inputId =
        questionType === "single"
          ? `bordered-radio-${option.id}`
          : `bordered-checkbox-${option.id}`;
      const inputType = questionType === "single" ? "radio" : "checkbox";
      return (
        <div
          key={option.id}
          className=" flex my-3 border border-blue-300 items-center px-3 rounded-md bg-white"
        >
          <img
            className="h-10 rounded-[50%] border border-slate-200 m-1 image-zoom hover:rounded-sm hover:shadow-lg hover:border-none hover:shadow-gray-100	"
            src="https://res.cloudinary.com/ddwapzxdc/image/upload/v1699098430/CourseImage/xncnmw3j3abseh29hf3o.webp"
            alt=""
          />
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
            onClick={() => handleDeleteOption(option.id)}
            className="ml-2 text-sm font-medium text-red-600"
          >
            Delete
          </button>
        </div>
      );
    });
  };

  return (
    <div className="px-5 py-3 bg-slate-100 ">
      <div className="my-3">
        <label
          htmlFor="about"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Write your question here{" "}
          <span className="text-red-800 text-xl	">*</span>
        </label>
        <div className="mt-2">
          <textarea
            id="about"
            name="about"
            value={questionTitle}
            onChange={handleQuestionTitleChange}
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
          <div className=" bg-slate-200 opacity-50 flex-6 m-4 py-10 rounded-md cursor-pointer hover:opacity-100">
            <div
              ref={wrapperRef}
              className="flex justify-center items-center relative overflow-hidden"
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {selectedFile ? (
                <div className="selected-file">
                  <div className="selected-file">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Question Image"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center mx-6">
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
        <select
          id="questionType"
          className="border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={questionType}
          onChange={handleQuestionTypeChange}
        >
          <option value="single">Single Choice</option>
          <option value="multiple">Multiple Choice</option>
        </select>
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
              <input
                id="isAnswer"
                type="checkbox"
                value={isAnswer}
                name={"bordered-radio"}
                className="w-5 h-5 text-blue-600"
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
            </div>

            <button
              onClick={handleAddOption}
              className="flex items-center justify-center gap-1 text-sm font-medium text-blue-600"
            >
              <AddIcon style={{ color: "rgb(37 99 235)" }} />
              <span>Add An Option</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionsInfo;
