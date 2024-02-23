import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import "../../course/course.scss";
import { AuthContext } from "../../../context/authContext";
import VisibilityIcon from "@mui/icons-material/Visibility";

import ReactQuill from "react-quill";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { formatDate, getText } from "../../../js/TAROHelper";
import ReviewsIcon from "@mui/icons-material/Reviews";
import AttachmentIcon from "@mui/icons-material/Attachment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { PaperClipIcon } from "@heroicons/react/20/solid";
export default function AssignmentDetail() {
  const location = useLocation();
  console.log(location.state?.assignment);
  const [assignment, setAssignment] = useState(location.state?.assignment);
  const [assignmentFiles, setAssignmentFiles] = useState(
    location.state?.assignment.SubmissionFiles
  );
  console.table(assignmentFiles);

  return (
    <>
      <div className="course-file-viewer gap-5 ">
        <div className="file-container outline-none mt-5  " tabIndex="0">
          <div className="px-4 sm:px-0 flex justify-between">
            <h3 className="text-2xl font-semibold leading-7 text-gray-900">
              {assignment.title}
            </h3>
            <button className="flex-none rounded-md hover:bg-blue-500 bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              Submit
            </button>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base	 font-medium leading-6 text-gray-900">
                  Assignment title
                </dt>
                <dd className="mt-1 text-base	 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {assignment?.AssignmentTitle}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base	 font-medium leading-6 text-gray-900">
                  Submitted at
                </dt>
                <dd className="mt-1 text-base	 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {assignment?.AssignmentDesc ? (
                    <span>{formatDate(assignment?.SubmissionDate)}</span>
                  ) : (
                    <span>
                      <em>None</em>
                    </span>
                  )}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base	font-medium leading-6 text-gray-900">
                  Student responses
                </dt>
                <dd className="mt-2 text-base	 text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    <div className="  flex-col  divide-y divide-gray-100">
                      <div className="flex-col">
                        <p className="font-semibold gap-4 py-4 pl-4 pr-5   flex items-center ">
                          <div className="flex items-center justify-center gap-1">
                            <AttachmentIcon />
                            <span>Attached</span>
                          </div>
                          <dd className="mt-2 text-base	 text-gray-900 sm:col-span-2 sm:mt-0 w-full">
                            <ul
                              role="list"
                              className="divide-y divide-gray-100 rounded-md border border-gray-200"
                            >
                              {assignmentFiles.length > 0 ? (
                                <>
                                  {assignmentFiles.map(
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
                                          <VisibilityIcon className="hover:text-indigo-500 cursor-pointer" />
                                        </div>
                                      </li>
                                    )
                                  )}
                                </>
                              ) : (
                                <span>
                                  <em>None</em>
                                </span>
                              )}
                            </ul>
                          </dd>
                        </p>
                      </div>

                      <p className="flex-col">
                        <div className="font-semibold gap-4 py-4 pl-4 pr-5  flex items-center  ">
                          <div className="flex items-center justify-center gap-1">
                            <EditNoteIcon />
                            <span>Note</span>
                          </div>
                        </div>
                      </p>
                    </div>
                  </ul>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base	 font-medium leading-6 text-gray-900">
                  Review & evaluation
                </dt>
                <dd className="mt-2 text-base	 text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    <div className="  flex-col  divide-y divide-gray-100">
                      <div className="flex-col">
                        <p className="font-semibold gap-4 py-4 pl-4 pr-5   flex items-center justify-between ">
                          <div className="flex items-center justify-center gap-1">
                            <CreditScoreIcon />
                            <span>Points</span>
                            <input
                              type="number"
                              id="number-input"
                              aria-describedby="helper-text-explanation"
                              class=" border border-gray-50 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                              required
                              min={0}
                              max={10}
                              disabled
                            />
                          </div>
                          <p className="font-medium  text-indigo-600 hover:text-indigo-500">
                            Edit
                          </p>
                        </p>
                      </div>

                      <p className="flex-col">
                        <div className="font-semibold gap-4 py-4 pl-4 pr-5  flex items-center  justify-between ">
                          <div className="flex items-center justify-center gap-1">
                            <ReviewsIcon />
                            <span>Review</span>
                          </div>
                          <p className="font-medium  text-indigo-600 hover:text-indigo-500">
                            Edit
                          </p>
                        </div>
                      </p>
                    </div>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
