import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../course/course.scss";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import ReactQuill from "react-quill";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { formatDateString, getText } from "../../../js/TAROHelper";
import ReviewsIcon from "@mui/icons-material/Reviews";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import Button from "@mui/material/Button";

export default function AssignmentDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(location.state?.assignment);
  const [assignmentFiles, setAssignmentFiles] = useState(
    location.state?.assignment.SubmissionFiles
  );
  const [assignmentReview, setAssignmentReview] = useState(
    location.state?.assignment.Review ? location.state?.assignment.Review : ""
  );
  const [assignmentPoint, setAssignmentPoint] = useState(
    location.state?.assignment.Score
  );

  const [isEditPoint, setIsEditPoint] = useState(false);
  const [isEditReview, setIsEditReview] = useState(false);

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
      await axios.put(`/courses/assignments/score/${assignment?.SubmissionId}`, {
        assignmentPoint: assignmentPoint,
      });
      setIsEditPoint(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="course-file-viewer gap-5 ">
        <div className="file-container outline-none mt-5  " tabIndex="0">
          <div className="px-4 sm:px-0 flex justify-between">
            <h3 className="text-2xl font-semibold leading-7 text-gray-900">
              {assignment?.title}
            </h3>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="flex-none rounded-md hover:bg-blue-500 bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Done
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
                    <span>{formatDateString(assignment?.SubmissionDate)}</span>
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
                              {assignmentFiles?.length > 0 ? (
                                <>
                                  {assignmentFiles?.map(
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
                              className={`border${
                                isEditPoint ? "" : " disabled"
                              } border-gray-50 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-center`}
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
                              className="font-medium text-black hover:text-indigo-500"
                              onClick={() => {
                                handleCloseEditPoint();
                              }}
                            >
                              Cancle
                            </p>
                          ) : (
                            <p
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={handleEditPointClick}
                            >
                              Edit
                            </p>
                          )}
                        </p>
                        {isEditPoint && (
                          <div className="mx-3 mb-3">
                            <Button
                              sx={{ color: "white", backgroundColor: "black" }}
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
                              className="font-medium text-black hover:text-indigo-500"
                              onClick={() => {
                                handleCloseEditReview();
                              }}
                            >
                              Cancle
                            </p>
                          ) : (
                            <p
                              className="font-medium text-indigo-600 hover:text-indigo-500"
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
                              sx={{ color: "white", backgroundColor: "black" }}
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
                          <div className="m-4 mt-0">
                            {getText(assignmentReview)}
                          </div>
                        )}
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