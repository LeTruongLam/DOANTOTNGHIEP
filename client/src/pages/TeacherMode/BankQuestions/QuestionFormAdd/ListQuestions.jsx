import React, { Fragment } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SignleChoice from "../../../../img/icons/04-single-choice.svg";
import MultipleChoice from "../../../../img/icons/multiple-choice-9.svg";
import TextInput from "../../../../img/icons/text-38.svg";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function StepperFirst({ questions, setQuestions, handleBack }) {
  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = questions.filter(
      (question) => question.id !== questionId
    );
    setQuestions(updatedQuestions);
  };

  return (
    <div>
      <div className="bg-slate-100 px-5 py-2">
        <div className="my-2">
          <ul>
            {questions.map((question) => (
              <li
                key={question.id}
                className="px-3 h-11 w-full flex justify-between items-center py-2 my-2 bg-white border-blue-500 border  rounded-md"
              >
                <div className="truncate flex-1">
                  <span>{question?.questionTitle}</span>
                </div>
                <div className="flex flex-1 justify-end items-center">
                  {question?.questionType === "Single Choice" && (
                    <img
                      className="bg-slate-200 w-8 h-8 rounded"
                      src={SignleChoice}
                      alt=""
                    />
                  )}
                  {question?.questionType === "Multiple Choice" && (
                    <img
                      className="bg-slate-200 w-8 h-8 rounded"
                      src={MultipleChoice}
                      alt=""
                    />
                  )}
                  {question?.questionType === "Text Input" && (
                    <img
                      className="bg-slate-200 w-8 h-8 p-1 rounded"
                      src={TextInput}
                      alt=""
                    />
                  )}
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                        />
                      </svg>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-max shadow-xl origin-top-right divide-y divide-gray-100 rounded-md bg-white  ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={classNames(
                                  active
                                    ? "bg-blue-600 text-white "
                                    : "text-black ",
                                  "block px-4 py-2 text-sm font-semibold pr-8"
                                )}
                              >
                                Edit
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={classNames(
                                  active
                                    ? "bg-blue-600 text-white "
                                    : "text-black ",
                                  "block px-4 py-2 text-sm font-semibold"
                                )}
                                onClick={() =>
                                  handleDeleteQuestion(question.id)
                                }
                              >
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
          <div onClick={handleBack} className="flex mt-4 w-max items-center gap-1 px-2 py-1 border rounded-md hover:cursor-pointer border-blue-600">
            <AddBoxIcon style={{ color: "rgb(37 99 235)" }} />
            <span className="text-blue-600 text-sm font-semibold">
              Add Question
            </span>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default StepperFirst;
