/* eslint-disable jsx-a11y/img-redundant-alt */
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import React, { useState, Fragment, useEffect, useRef } from "react";

import QuestionsList from "./QuestionsList";

function ExamForm({ open, setOpen, chapters }) {
  const [questionList, setQuestionList] = useState([]);
  return (
    <Dialog
      className="scroll "
      fullWidth
      sx={{ m: 1 }}
      open={open}
      style={{ maxWidth: "7xl !important" }}
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
                    className="w-full min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    placeholder="Enter  description "
                  />
                </div>
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
              <div className="my-3">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Exam quiz
                </label>
                <div className="mt-2 flex flex-col items-center justify-start gap-3">
                  {questionList.length}
                  {questionList.map((question, index) => (
                    <div key={index}>
                      <p>{question}</p>
                    </div>
                  ))}
                </div>
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
