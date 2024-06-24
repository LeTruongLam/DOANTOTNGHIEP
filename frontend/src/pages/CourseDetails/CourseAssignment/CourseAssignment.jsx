/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef, useContext } from "react";
import Confetti from "react-confetti";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/context/authContext";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import { formatDateString, getText } from "@/js/TAROHelper";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import NoResultFound from "@/pages/NotFounds/NoResultFound";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import AssignmentList from "./AssignmentList";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CourseAssignment() {
  const { currentUser } = useContext(AuthContext);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [assignment, setAssignment] = useState();
  const [assignmentList, setAssignmentList] = useState([]);
  const [attachFile, setAttachFile] = useState([]);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState();
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState();
  const [assignmentId, setAssignmentId] = useState();
  const [congratulation, setCongratulation] = useState(false);
  const [value, setValue] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState({});
  const { courseId, chapterId } = useParams();

  const [loading, setLoading] = useState(true);

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files) {
      const updatedList = [...selectedFiles];
      for (let i = 0; i < files.length; i++) {
        updatedList.push(files[i]);
      }
      setSelectedFiles(updatedList);
    }
  };

  const handleChangeClick = () => {
    fileInputRef.current.click();
  };
  useEffect(() => {
    fetchAssignmentData();
  }, []);
  const fetchAssignmentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignments`
      );
      setAssignment(response.data[0]);
      fetchAssignmentFiles(response.data[0].AssignmentId);
      fetchAssignmentSubmitted(response.data[0].AssignmentId);
      setAssignmentList(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const fetchAssignmentFiles = async (assignmentId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignmentfile/${assignmentId}`
      );
      setAttachFile(response.data);
      setSelectedDoc(response.data[0]);
    } catch (error) {
      console.error("Error fetching assignment files:", error);
    }
  };
  const fetchAssignmentSubmitted = async (assignmentId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/courses/assignments/${assignmentId}/submitted/${currentUser.UserId}`
      );
      if (response.data.length > 0) {
        setSubmissionStatus(response.data[0].Status);
        setSubmissionFiles(response.data[0].SubmissionFiles);
        setAssignmentSubmitted(response.data[0]);
        setAssignmentId(response.data[0].AssignmentId);
      } else {
        setAssignmentSubmitted({});
        setSubmissionFiles([]);
        setSubmissionStatus(0);
      }
    } catch (error) {
      console.error("Error fetching assignment Submitted:", error);
    }
  };
  const docs = [
    {
      uri: selectedDoc?.FileUrl,
    },
  ];
  const handleChangeStatus = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:8800/api/courses/assignments/${assignment.AssignmentId}/submitted/status`,
        {
          submissionStatus: !submissionStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmissionStatus(submissionStatus === 0 ? 1 : 0);
    } catch (error) {
      console.error("Error updating assignment status:", error);
    }
  };

  const handleSubmit = async () => {
    if (submissionStatus === 0) {
      if (selectedFiles.length > 0) {
        try {
          const fileData = new FormData();
          const length = selectedFiles.length;
          for (let i = 0; i < length; i++) {
            fileData.append("documentSubmit", selectedFiles[i]);
          }
          fileData.append("assignmentId", assignment.AssignmentId);
          fileData.append("chapterId", chapterId);
          fileData.append("userId", currentUser.UserId);
          fileData.append("courseId", courseId);
          fileData.append("submissionFiles", JSON.stringify(submissionFiles));

          await axios.post(
            `http://localhost:8800/api/users/chapters/uploadAssignmentFile/${assignment.AssignmentId}/submission`,
            fileData
          );
          fetchAssignmentData();
          setCongratulation(true);
          setTimeout(function () {
            setCongratulation(false);
          }, 3000);
          setSelectedFiles([]);
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const submissionData = {
            assignmentId: assignment.AssignmentId,
            chapterId: chapterId,
            userId: currentUser.UserId,
            courseId: courseId,
          };
          await axios.post(
            `http://localhost:8800/api/courses/chapters/${assignment.ChapterId}/submission`,
            submissionData
          );
          setCongratulation(true);
          setTimeout(function () {
            setCongratulation(false);
          }, 3000);
        } catch (error) {
          console.log(error);
        }
      }
      handleChangeStatus();
    } else if (submissionStatus === 1) {
      handleChangeStatus();
    }
  };
  const handleDeleteFile = async (assignmentFileId) => {
    try {
      await axios.delete(
        `http://localhost:8800/api/courses/chapters/${chapterId}/assignments/${assignmentId}/submission/assignmentfile/${assignmentFileId}`,
        {
          userId: currentUser.UserId,
        }
      );
    } catch (error) {
      console.error("Error fetching assignment files:", error);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Backdrop
            sx={{
              color: "rgba(0, 0, 0, 0.8)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <>
          {assignment ? (
            <>
              {congratulation && <Confetti />}
              <div className="body-height flex flex-row gap-5">
                <div className="w-[70%] h-full px-5 border-r border-slate-300 ">
                  <div className="w-full h-full">
                    <DocViewer
                      documents={docs}
                      pluginRenderers={DocViewerRenderers}
                    />
                  </div>
                </div>
                <div className="course-file-viewer gap-5 w-[30%]  mr-5">
                  <div
                    className="file-container outline-none mt-5  "
                    tabIndex="0"
                  >
                    <div className="flex justify-between items-center">
                      {assignmentSubmitted &&
                      assignmentSubmitted?.Status === 1 ? (
                        <span className="italic text-red-700 font-semibold">
                          {formatDateString(
                            assignmentSubmitted?.SubmissionDate
                          )}
                        </span>
                      ) : (
                        <div></div>
                      )}

                      <button
                        className="flex-none rounded-md text-base hover:bg-blue-500 bg-black px-3 py-1.5  font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        onClick={handleSubmit}
                      >
                        {submissionStatus === 1
                          ? "Hoàn tác nộp bài"
                          : " Nộp bài"}
                      </button>
                    </div>
                    <AssignmentList
                      assignmentList={assignmentList}
                      setAssignment={setAssignment}
                      fetchAssignmentFiles={fetchAssignmentFiles}
                      fetchAssignmentSubmitted={fetchAssignmentSubmitted}
                    />
                    <div className="px-2 py-2 ">
                      <dt className="text-base 	font-medium leading-6 text-gray-900">
                        Thời hạn đến{" "}
                        <span>{formatDateString(assignment?.EndDate)}</span>
                      </dt>
                    </div>
                    <div className="px-2 py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <dt className="text-base 	font-medium leading-6 text-gray-900">
                        <span className="bg-zinc-100 flex max-w-max items-center	 px-3 py-1 rounded-xl">
                          Mô tả
                        </span>
                      </dt>
                      <dd className="mt-2  text-base  bg-zinc-100 rounded-md	 text-gray-900 sm:col-span-2 sm:mt-0">
                        <p className="py-2 px-3 italic opacity-90">
                          {assignment?.AssignmentDesc
                            ? getText(assignment?.AssignmentDesc)
                            : "Không có mô tả"}
                        </p>
                      </dd>
                    </div>
                    <div className=" py-2 ">
                      <dt className="text-base 	font-medium leading-6 text-gray-900">
                        <span className="bg-zinc-100 flex max-w-max items-center	mb-2 px-3 py-1 rounded-xl">
                          Đính kèm
                        </span>
                      </dt>
                      <dd className="mt-2 text-base  bg-zinc-100 rounded-xl	 text-gray-900 sm:col-span-2 sm:mt-0">
                        <dd className=" text-base	 text-gray-900 sm:col-span-2 sm:mt-0 w-full">
                          {attachFile.length > 0 ? (
                            attachFile.map((file, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between first:pt-3 last:pb-3 py-2 px-3 text-sm leading-4"
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
                                  className="inline-flex items-center justify-between w-full p-3 text-gray-500 bg-white border border-slate-300 rounded-lg cursor-pointer peer-checked:outline-blue-500 peer-checked:outline-1 peer-checked:outline peer-checked:border-blue-500 peer-checked:text-blue-500 hover:text-gray-600 hover:bg-slate-100"
                                  onClick={() => {
                                    setSelectedDoc(file);
                                  }}
                                >
                                  <div className="flex w-0 flex-1 items-center">
                                    <PaperClipIcon
                                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                      <span className="truncate font-medium">
                                        {file?.FileTitle}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                                    <a
                                      href={file?.FileUrl}
                                      download
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                      Tải xuống
                                    </a>
                                  </div>
                                </label>
                              </li>
                            ))
                          ) : (
                            <p className="py-2 px-3 italic opacity-90">
                              Không có đính kèm
                            </p>
                          )}
                        </dd>
                      </dd>
                    </div>
                    <div>
                      <p className="font-semibold gap-4 py-2    flex justify-between ">
                        <div className="bg-zinc-100 px-3 py-1 flex items-center rounded-xl justify-center gap-1">
                          <AttachmentIcon />
                          <span>Nộp đính kèm</span>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleFileSelect}
                          multiple
                          disabled={submissionStatus === 1}
                        />

                        <button
                          onClick={handleChangeClick}
                          type="button"
                          className={`rounded-md ${
                            submissionStatus === 1 && "	 cursor-not-allowed	"
                          } bg-white  px-2.5 py-1.5 text-sm font-semibold text-black hover:outline-blue-600 hover:outline shadow-sm ring-1 ring-inset ring-gray-300 hover:opacity-80`}
                        >
                          Chọn tệp tin
                        </button>
                      </p>
                      <dd className="mt-2 bg-zinc-100  rounded-xl text-base	 text-gray-900 sm:col-span-2 sm:mt-0 w-full">
                        {submissionFiles && (
                          <>
                            {submissionFiles.map((submissionFile, index) => (
                              <li
                                key={index}
                                className="flex   border-gray-100 last:border-none	 items-center justify-between py-3 pl-4 pr-5 text-sm leading-6"
                              >
                                <div className="flex w-0 flex-1 items-center">
                                  <PaperClipIcon
                                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <div className="ml-4 flex min-w-0 flex-1 gap-2 justify-between">
                                    <span className="truncate font-medium text-blue-500">
                                      {submissionFile.fileTitle}
                                    </span>
                                    <div className="flex gap-3 justify-center items-center">
                                      <a
                                        href={submissionFile?.fileUrl}
                                        download
                                        className="font-medium  text-indigo-600 hover:text-indigo-500"
                                      >
                                        Download
                                      </a>

                                      {submissionStatus === 0 ? (
                                        <CloseIcon
                                          onClick={() =>
                                            handleDeleteFile(
                                              submissionFile.assignmentFileId
                                            )
                                          }
                                          fontSize="small"
                                        />
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </>
                        )}
                      </dd>
                      <div>
                        {selectedFiles && (
                          <div className=" bg-zinc-100 rounded-md">
                            {selectedFiles.map((file, index) => (
                              <li
                                key={index}
                                className="flex  last:border-none	 items-center justify-between py-2 pl-4 pr-5 text-sm leading-6"
                              >
                                <div className="flex w-0 flex-1 items-center">
                                  <PaperClipIcon
                                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <div className="ml-4 flex min-w-0 flex-1 gap-2 justify-between">
                                    <span className="truncate font-medium text-blue-500">
                                      {file.name}
                                    </span>
                                    <CloseIcon fontSize="small" />
                                  </div>
                                </div>
                              </li>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-2 py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <dt className="text-base 	font-medium leading-6 text-gray-900">
                        <span className="bg-zinc-100 flex max-w-max items-center	 px-3 py-1 rounded-xl">
                          Nhận xét và đánh giá
                        </span>
                      </dt>
                      {assignmentSubmitted && (
                        <dd className="mt-2 text-base  bg-zinc-100 rounded-md	 text-gray-900 sm:col-span-2 sm:mt-0">
                          <p className="py-2 px-3 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <div className="flex justify-center gap-3">
                                <CreditScoreIcon />
                                <span className=" font-semibold">Điểm</span>
                              </div>
                              <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-base font-bold text-red-700 ring-1 ring-inset ring-red-600/10">
                                {assignmentSubmitted?.Score}
                              </span>
                            </div>
                            <div className="flex flex-col items-start">
                              <div className="flex justify-center gap-3">
                                <ReviewsIcon />
                                <span className=" font-semibold">Nhận xét</span>
                              </div>
                              <p className="mt-1">
                                {assignmentSubmitted?.Review}
                              </p>
                            </div>
                          </p>
                        </dd>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[100vh - 60px]">
              <NoResultFound />
            </div>
          )}
        </>
      )}
    </>
  );
}
