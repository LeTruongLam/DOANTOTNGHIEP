import React, { useEffect, Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import "../../course/course.scss";
import axios from "axios";
import ReactQuill from "react-quill";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { formatDateString, getText } from "../../../js/TAROHelper";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BlockIcon from "@mui/icons-material/Block";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AssignmentDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState();

  const [assignment, setAssignment] = useState();
  const [classStudent, setClassStudent] = useState(
    location.state?.classStudent
  );

  const [assignmentFiles, setAssignmentFiles] = useState(
    location.state?.student?.SubmissionFiles || []
  );
  const [assignmentReview, setAssignmentReview] = useState(
    location.state?.student?.Review
  );
  const [assignmentPoint, setAssignmentPoint] = useState(
    location.state?.student?.Score || null
  );
  const [isEditPoint, setIsEditPoint] = useState(false);
  const [isEditReview, setIsEditReview] = useState(false);
  const fetchAssignmentSubmitted = async () => {
    try {
      const res = await axios.get(
        `/courses/assignments/${location.state?.assignmentId}/submitted/${location.state?.userId}`
      );
      setSelected(res.data[0]);
      setAssignment(res.data[0]);
      setAssignmentPoint(res.data[0]?.Score);
      setAssignmentFiles(res.data[0]?.SubmissionFiles[0]);
      setAssignmentReview(res.data[0]?.Review);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(location.state?.student);
    fetchAssignmentSubmitted();
  }, []);

  const handleEditPointClick = () => {
    setIsEditPoint(true);
  };
  const handleEditReviewClick = () => {
    setIsEditReview(true);
  };
  const handleCloseEditPoint = () => {
    setIsEditPoint(false);
  };
  const handleCloseEditReview = () => {
    setIsEditReview(false);
  };
  const updateAssignmentReview = async () => {
    try {
      await axios.put(
        `/courses/assignments/review/${assignment?.SubmissionId}`,
        {
          assignmentReview: assignmentReview,
        }
      );
      setIsEditReview(false);
    } catch (err) {
      console.log(err);
    }
  };
  const updateAssignmentPoint = async () => {
    try {
      await axios.put(
        `/courses/assignments/score/${assignment?.SubmissionId}`,
        {
          assignmentPoint: assignmentPoint,
        }
      );
      setIsEditPoint(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="navbar  mx-5">
        <div className="navbar-container">
          <div
            className="logo"
            style={{ display: "flex", alignItems: "center", gap: "16px" }}
          >
            <span className="font-semibold">
              {assignment?.StudentName} {assignment?.StudentCode}
            </span>
          </div>
          <div className="links">
            <ExitToAppIcon />
            <span>Exit</span>
          </div>
        </div>
      </div>
      <div className="body-height flex flex-row gap-5">
        <div className="w-[70%] my-3 px-5 border-r border-slate-300 ">
          <div style={{ width: "100%", height: "100%" }}>
            <iframe
              title="Google Docs Viewer"
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                assignmentFiles?.fileUrl
              )}&embedded=true`}
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
            />
          </div>
        </div>
        <div className="course-file-viewer gap-5 w-[30%]  mr-5">
          <div className="file-container outline-none mt-5  " tabIndex="0">
            <Listbox value={selected} onChange={setSelected}>
              {({ open }) => (
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                    <span className="flex items-center">
                      <span className="ml-3 block truncate">
                        {selected?.StudentName} {selected?.StudentCode}
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
                      {classStudent.map((student) => (
                        <Listbox.Option
                          key={student.StudentId}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-indigo-600 text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={student}
                          onClick={() => {
                            setSelected(student);
                            navigate(
                              `/Assignment-Detail/${student?.SubmissionId}`,
                              {
                                state: {
                                  student: student,
                                  classStudent: classStudent,
                                  userId: student.UserId,
                                  assignmentId: location.state?.assignmentId,
                                },
                              }
                            );
                          }}
                        >
                          {({ selected, active }) => (
                            <>
                              <div className="flex items-center">
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "ml-3 block truncate"
                                  )}
                                >
                                  {student.StudentName} {student.StudentCode}
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
            {assignment?.Status === 1 ? (
              <div className="flex mt-3 justify-start items-center gap-2">
                <CheckIcon
                  className="h-5 w-5 text-blue-800"
                  aria-hidden="true"
                />
                <span className="text-blue-800">
                  Turned in {formatDateString(assignment?.SubmissionDate)}
                </span>
              </div>
            ) : (
              <div className="flex mt-3 justify-start items-center gap-2">
                <BlockIcon color="error" />
                <span className="text-red-800">Not turned in</span>
              </div>
            )}

            <div className="mt-3 border-t border-slate-300">
              <div className="px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                <dt className="text-base	font-medium leading-6 text-gray-900">
                  Student responses
                </dt>
                <dd className="mt-2 text-base	 text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-slate-300 rounded-md border border-slate-300"
                  >
                    <div className="  flex-col  divide-y divide-slate-300">
                      <div className="flex-col">
                        <p className="font-semibold gap-4   flex items-center ">
                          <dd className="mt-2 text-base	 text-gray-900 sm:col-span-2 sm:mt-0 w-full">
                            <ul role="list ">
                              {assignment?.Status === 1 ? (
                                <>
                                  {assignment.SubmissionFiles?.map(
                                    (assignmentFile, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                                      >
                                        <div className="flex w-0 flex-1 items-center">
                                          <PaperClipIcon
                                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                                            aria-hidden="true"
                                          />
                                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                            <span className="truncate font-medium">
                                              {assignmentFile.fileTitle}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                                          <a
                                            href={assignmentFile?.fileUrl}
                                            download
                                            className="font-medium  text-indigo-600 hover:text-indigo-500"
                                          >
                                            Download
                                          </a>
                                        </div>
                                      </li>
                                    )
                                  )}
                                </>
                              ) : (
                                <span className=" px-4 italic opacity-50">
                                  None
                                </span>
                              )}
                            </ul>
                          </dd>
                        </p>
                      </div>
                    </div>
                  </ul>
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                <dt className="text-base	 font-medium leading-6 text-gray-900">
                  Review & evaluation
                </dt>
                <dd className="mt-2 text-base	 text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-slate-300 rounded-md border border-slate-300"
                  >
                    <div className="  flex-col  divide-y divide-slate-300">
                      <div className="flex-col">
                        <p className="font-semibold gap-4 py-2 pl-4 pr-5   flex items-center justify-between ">
                          <div className="flex items-center justify-center gap-1">
                            <CreditScoreIcon />
                            <span>Points</span>
                            <input
                              type="number"
                              id="number-input"
                              aria-describedby="helper-text-explanation"
                              className={`border${
                                isEditPoint ? "" : " disabled"
                              } border-gray-50 text-gray-900 text-sm outline-blue-500
                              rounded-lg block w-full my-2 py-1 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-center`}
                              required
                              min={0}
                              max={10}
                              value={assignmentPoint}
                              onChange={(e) =>
                                setAssignmentPoint(e.target.value)
                              }
                              disabled={!isEditPoint}
                            />
                          </div>
                          {isEditPoint ? (
                            <p
                              className="font-medium hover:cursor-pointer text-black hover:text-indigo-500"
                              onClick={() => {
                                handleCloseEditPoint();
                              }}
                            >
                              Cancle
                            </p>
                          ) : (
                            <p
                              className="font-medium hover:cursor-pointer text-indigo-600 hover:text-indigo-500"
                              onClick={handleEditPointClick}
                            >
                              Edit
                            </p>
                          )}
                        </p>
                        {isEditPoint && (
                          <div className="mx-3 mb-3">
                            <Button
                              sx={{
                                color: "white",
                                backgroundColor: "black",
                              }}
                              style={{
                                marginTop: "12px",
                                width: "max-content",
                              }}
                              variant="contained"
                              onClick={updateAssignmentPoint}
                            >
                              Save
                            </Button>
                          </div>
                        )}
                      </div>

                      <p className="flex-col">
                        <div className="font-semibold gap-4 py-4 pl-4 pr-5  flex items-center  justify-between ">
                          <div className="flex items-center justify-center gap-1">
                            <ReviewsIcon />
                            <span>Review</span>
                          </div>
                          {isEditReview ? (
                            <p
                              className="font-medium hover:cursor-pointer text-black hover:text-indigo-500"
                              onClick={() => {
                                handleCloseEditReview();
                              }}
                            >
                              Cancle
                            </p>
                          ) : (
                            <p
                              className="font-medium hover:cursor-pointer text-indigo-600 hover:text-indigo-500"
                              onClick={handleEditReviewClick}
                            >
                              Edit
                            </p>
                          )}
                        </div>

                        {isEditReview ? (
                          <div className="m-3">
                            <ReactQuill
                              value={assignmentReview}
                              onChange={setAssignmentReview}
                            />
                            <Button
                              sx={{
                                color: "white",
                                backgroundColor: "black",
                              }}
                              style={{
                                marginTop: "12px",
                                width: "max-content",
                              }}
                              variant="contained"
                              onClick={updateAssignmentReview}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className=" mb-3 ml-4">
                            <span>{getText(assignmentReview)}</span>
                          </div>
                        )}
                      </p>
                    </div>
                  </ul>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
