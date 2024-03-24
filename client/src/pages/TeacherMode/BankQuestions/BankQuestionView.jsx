import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddIcon from "@mui/icons-material/Add";
const people = [
  {
    id: 1,
    name: "Wade Cooper",
    avatar:
      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 2,
    name: "Arlene Mccoy",
    avatar:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function BankQuestionView() {
  const [selected, setSelected] = useState(people[1]);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [quizFormOpen, setQuizFormOpen] = React.useState(false);
  const [quizFormData, setQuizFormData] = React.useState({
    question: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  });

  const handleAddQuizClick = () => {
    setQuizFormOpen(true);
  };

  const handleQuizFormClose = () => {
    setQuizFormOpen(false);
  };

  const handleQuestionChange = (e) => {
    setQuizFormData({ ...quizFormData, question: e.target.value });
  };

  const handleOptionChange = (index) => {
    return (e) => {
      const newOptions = [...quizFormData.options];
      newOptions[index] = e.target.value;
      setQuizFormData({ ...quizFormData, options: newOptions });
    };
  };

  const handleSaveQuiz = () => {
    // Add logic to save quiz data
    setQuizFormOpen(false);
  };
  return (
    <>
      <div className="flex justify-between items-center my-3 border-b border-slate-300 pb-3">
        <span className="text-xl font-bold">
          The Data Science Course: Complete Data Science Bootcamp 2023
        </span>
        <button
          onClick={handleClickOpen}
          type="submit"
          className="flex-none rounded-md hover:bg-blue-500 bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <AddCircleOutlineIcon className="mr-1" />
          Quiz
        </button>
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
          <div className="bg-slate-100 px-5 py-3">
            <Listbox value={selected} onChange={setSelected}>
              {({ open }) => (
                <>
                  <Listbox.Label className="block text-base font-medium leading-6 text-gray-900">
                    Select Chapter
                  </Listbox.Label>
                  <div className="relative mt-2">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                      <span className="flex items-center">
                        <img
                          src={selected.avatar}
                          alt=""
                          className="h-5 w-5 flex-shrink-0 rounded-full"
                        />
                        <span className="ml-3 block truncate">
                          {selected.name}
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
                      <Listbox.Options className=" z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {people.map((person) => (
                          <Listbox.Option
                            key={person.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={person}
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="flex items-center">
                                  <img
                                    src={person.avatar}
                                    alt=""
                                    className="h-5 w-5 flex-shrink-0 rounded-full"
                                  />
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "ml-3 block truncate"
                                    )}
                                  >
                                    {person.name}
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
                </>
              )}
            </Listbox>
            <div className="my-5">
              <div
                onClick={handleAddQuizClick}
                className="flex w-max items-center gap-1 px-2 py-1 border rounded-md hover:cursor-pointer border-blue-600		"
              >
                <AddBoxIcon style={{ color: "rgb(37 99 235)" }} />
                <span className="text-sm font-medium">Add Quiz</span>
              </div>
            </div>
            {quizFormOpen && (
              <div>
                <div className="my-3">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Write your question here
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select your question type
                  </label>
                  <select
                    id="countries"
                    class=" border border-blue-300 text-black text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  >
                    <option value="US">Single Choice</option>
                    <option value="CA">Multiple Choice</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Input options for the question and select the correct
                  </label>
                  <div>
                    <div class="flex items-center px-3     rounded-md bg-white ">
                      <label
                        for="bordered-radio-1"
                        class="w-full py-3 ms-2 text-sm font-medium opacity-80 text-gray-900 "
                      >
                        Default radio
                      </label>
                      <input
                        id="bordered-radio-1"
                        type="radio"
                        value=""
                        name="bordered-radio"
                        class="w-4 h-4 text-blue-600 "
                      />
                    </div>
                    <div class="flex items-center px-3 mt-4   rounded-md bg-white">
                      <label
                        for="bordered-radio-2"
                        class="w-full py-3 ms-2 text-sm font-medium opacity-80 text-gray-900"
                      >
                        Checked state
                      </label>
                      <input
                        checked
                        id="bordered-radio-2"
                        type="radio"
                        value=""
                        name="bordered-radio"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex w-max items-center gap-1 		">
                    <AddIcon style={{ color: "rgb(37 99 235)" }} />
                    <span className="text-sm font-medium text-blue-600">
                      Add An Option
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mx-5 mt-4">
            <button
              type="button"
              class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Light
            </button>
            <div className="flex">
              <button
                type="button"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Light
              </button>
              <button
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Default
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default BankQuestionView;
