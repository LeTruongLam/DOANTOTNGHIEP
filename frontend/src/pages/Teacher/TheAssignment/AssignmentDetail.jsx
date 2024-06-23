/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useEffect, Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import "../../../course/course.scss";
import axios from "axios";
import ReactQuill from "react-quill";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { formatDateString, getText } from "@/js/TAROHelper";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BlockIcon from "@mui/icons-material/Block";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import NoResultFound from "../../NotFounds/NoResultFound";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AssignmentDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { submissionId, courseId, assignmentId } = useParams();

  const [selected, setSelected] = useState();

  const [assignment, setAssignment] = useState();
  const [classStudent, setClassStudent] = useState(
    location.state?.classStudent
  );

  const [assignmentFiles, setAssignmentFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});
  const [assignmentReview, setAssignmentReview] = useState("");
  const [assignmentPoint, setAssignmentPoint] = useState();
  const [isEditPoint, setIsEditPoint] = useState(false);
  const [isEditReview, setIsEditReview] = useState(false);
  const fetchAssignmentSubmitted = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/assignments/submitted/${submissionId}`
      );
      const data = res.data;
      setSelected(data[0]);
      setAssignment(data[0]);
      setAssignmentPoint(data[0]?.Score);
      setAssignmentFiles(data[0]?.SubmissionFiles);
      setSelectedFile(data[0]?.SubmissionFiles[0]);
      setAssignmentReview(data[0]?.Review);
    } catch (error) {
      console.log(error);
    }
  };
  const docs = [
    {
      uri:
        selectedFile?.fileUrl ||
        "https://res.cloudinary.com/ddwapzxdc/raw/upload/v1701001607/CourseDocument/vroivwlk4k3bmev534cf.docx",
    },
  ];
  useEffect(() => {
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
        `http://localhost:8800/api/courses/assignments/review/${assignment?.SubmissionId}`,
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
        `http://localhost:8800/api/courses/assignments/score/${assignment?.SubmissionId}`,
        {
          assignmentPoint: assignmentPoint,
        }
      );
      setIsEditPoint(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleNextAssignmentDetail = (student) => {
    setAssignment(student);
    setAssignmentPoint(student?.Score);
    setAssignmentReview(student?.Review);
    if (student?.SubmissionFiles) {
      setSelectedFile(student?.SubmissionFiles[0]);
    } else {
      setSelectedFile([]);
    }

    navigate(
      `/teacher/courses/${courseId}/assignments/${assignmentId}/assignment-detail/${student?.SubmissionId}`,
      {
        state: {
          classStudent: classStudent,
        },
      }
    );
  };
  const handleExit = () => {
    navigate(
      `/teacher/courses/${courseId}/assignments/${assignmentId}/classrooms`
    );
  };
  return (
    <div className="flex flex-col">
      <div className="body-height flex flex-row gap-5">
        <div className="w-[70%] my-3 px-5 border-r border-slate-300 ">
          <div className="w-full h-full">
            {assignmentFiles ? (
              <DocViewer
                documents={docs}
                pluginRenderers={DocViewerRenderers}
              />
            ) : (
              <NoResultFound />
            )}
          </div>
        </div>
        <div className="course-file-viewer gap-5 w-[30%]  mr-5">
          <div className="file-container outline-none mt-5  " tabIndex="0">
            <div
              className="flex justify-end hover:cursor-pointer mb-3"
              onClick={handleExit}
            >
              <ExitToAppIcon />
              <span>Thoát</span>
            </div>
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
                            handleNextAssignmentDetail(student);
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
                  Đã nộp lúc {formatDateString(assignment?.SubmissionDate)}
                </span>
              </div>
            ) : (
              <div className="flex mt-3 justify-start items-center gap-2">
                <BlockIcon color="error" />
                <span className="text-red-800">Chưa nộp bài</span>
              </div>
            )}

            <div className="mt-3 border-t border-slate-300">
              <div className="px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                <dt className="text-base	font-medium leading-6 text-gray-900">
                  Phản hồi của sinh viên
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
                            <ul role="list">
                              {assignment?.Status === 1 ? (
                                <>
                                  {assignment?.SubmissionFiles?.map(
                                    (assignmentFile, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center justify-between first:pt-4 last:pb-4 py-2 pl-4 pr-5 text-sm leading-6"
                                      >
                                        <input
                                          type="radio"
                                          id={`hosting-small-${index}`}
                                          name="hosting"
                                          value="hosting-small"
                                          className="hidden peer"
                                          required
                                        />
                                        <label
                                          htmlFor={`hosting-small-${index}`}
                                          onClick={() => {
                                            setSelectedFile(assignmentFile);
                                          }}
                                          class="inline-flex items-center justify-between w-full p-3 text-gray-500 bg-white border border-slate-300 rounded-lg cursor-pointer peer-checked:outline-blue-500 		peer-checked:outline-1 peer-checked:outline	     peer-checked:border-blue-500 peer-checked:text-blue-500 hover:text-gray-600 hover:bg-slate-100 "
                                        >
                                          <div className="flex w-0 flex-1 items-center">
                                            <PaperClipIcon
                                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                                              aria-hidden="true"
                                            />
                                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                              <span className="truncate font-medium">
                                                {assignmentFile?.fileTitle}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                                            <a
                                              href={assignmentFile?.fileUrl}
                                              download
                                              className="font-medium  text-indigo-600 hover:text-indigo-500"
                                            >
                                              Tải về
                                            </a>
                                          </div>
                                        </label>
                                      </li>
                                    )
                                  )}
                                </>
                              ) : (
                                <span className=" px-4 italic opacity-50">
                                  Không có phản hồi
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
                  Nhận xét & đánh giá
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
                              Hủy
                            </p>
                          ) : (
                            <p
                              className="font-medium hover:cursor-pointer text-indigo-600 hover:text-indigo-500"
                              onClick={handleEditPointClick}
                            >
                              Sửa
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
                              Lưu
                            </Button>
                          </div>
                        )}
                      </div>

                      <p className="flex-col">
                        <div className="font-semibold gap-4 py-4 pl-4 pr-5  flex items-center  justify-between ">
                          <div className="flex items-center justify-center gap-1">
                            <ReviewsIcon />
                            <span>Nhận xét</span>
                          </div>
                          {isEditReview ? (
                            <p
                              className="font-medium hover:cursor-pointer text-black hover:text-indigo-500"
                              onClick={() => {
                                handleCloseEditReview();
                              }}
                            >
                              Hủy
                            </p>
                          ) : (
                            <p
                              className="font-medium hover:cursor-pointer text-indigo-600 hover:text-indigo-500"
                              onClick={handleEditReviewClick}
                            >
                              Sửa
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
                              Lưu
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
