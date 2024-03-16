/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useEffect,
  Fragment,
  useState,
  useRef,
  useContext,
} from "react";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../course/course.scss";
import Confetti from "react-confetti";
import { AuthContext } from "../../../context/authContext";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatDateString, getText } from "../../../js/TAROHelper";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import NoResultFound from "../../NotFounds/NoResultFound";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import BlockIcon from "@mui/icons-material/Block";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import AssignmentList from "./AssignmentList";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
const docs = [
  {
    uri: "https://res.cloudinary.com/ddwapzxdc/raw/upload/v1701001607/CourseDocument/vroivwlk4k3bmev534cf.docx",
  },
  {
    uri: "https://res.cloudinary.com/ddwapzxdc/raw/upload/v1701001833/CourseDocument/a5l3oeffz42tcaqb2qum.pptx",
  },
  {
    uri: "https://res.cloudinary.com/ddwapzxdc/image/upload/v1701011815/CourseDocument/och5g3ajzkracjjiuebo.pdf",
  },
  {
    uri: "https://res.cloudinary.com/ddwapzxdc/raw/upload/v1701012003/CourseDocument/jrxk54u3qs8ncidv6twr.xlsx",
  },
];
export default function CourseAssignment() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
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
  const [value, setValue] = React.useState(0);

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
  const fetchAssignmentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/courses/chapters/${location.state?.chapterId}/assignments`
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
        `/courses/chapters/${location.state?.chapterId}/assignmentfile/${assignmentId}`
      );
      setAttachFile(response.data);
      // console.log(response.data)
    } catch (error) {
      console.error("Error fetching assignment files:", error);
    }
  };
  const fetchAssignmentSubmitted = async (assignmentId) => {
    try {
      const response = await axios.get(
        `/courses/assignments/${assignmentId}/submitted/${currentUser.UserId}`
      );
      if (response.data.length > 0) {
        setSubmissionStatus(response.data[0].Status);
        setSubmissionFiles(response.data[0].SubmissionFiles);
        setAssignmentSubmitted(response.data[0]);
        setAssignmentId(response.data[0].AssignmentId);
      } else {
        setAssignmentSubmitted();
        setSubmissionFiles([]);
        setSubmissionStatus();
      }
    } catch (error) {
      console.error("Error fetching assignment Submitted:", error);
    }
  };

  const handleChangeStatus = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `/courses/assignments/${assignment.AssignmentId}/submitted/status`,
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
  useEffect(() => {
    fetchAssignmentData();
  }, [location.state?.chapterId]);

  // const handleNextAssignment = async (assignmentId) => {
  //   setLoading(true);
  //   try {
  //     const chapterId = location.state?.chapterId;
  //     const response = await axios.get(
  //       `/courses/chapters/${chapterId}/assignments/${assignmentId}`
  //     );
  //     setAssignment(response.data);
  //     fetchAssignmentFiles(assignmentId);
  //     setLoading(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handleSubmit = async () => {
  //   if (selectedFiles.length > 0) {
  //     try {
  //       const fileData = new FormData();
  //       const length = selectedFiles.length;
  //       for (let i = 0; i < length; i++) {
  //         fileData.append("documentSubmit", selectedFiles[i]);
  //       }
  //       fileData.append("assignmentId", assignment.AssignmentId);
  //       fileData.append("chapterId", location.state?.chapterId);
  //       fileData.append("userId", currentUser.UserId);
  //       fileData.append("courseId", location.state?.courseId);
  //       fileData.append("submissionFiles", JSON.stringify(submissionFiles));

  //       await axios.post(
  //         `/users/chapters/uploadAssignmentFile/${assignment.AssignmentId}/submission`,
  //         fileData
  //       );
  //       if (submissionStatus === 0) {
  //         setCongratulation(true);
  //         setTimeout(function () {
  //           setCongratulation(false);
  //         }, 3000);
  //       }
  //       setSelectedFiles([]);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     try {
  //       const submissionData = {
  //         assignmentId: assignment.AssignmentId,
  //         chapterId: location.state?.chapterId,
  //         userId: currentUser.UserId,
  //         courseId: location.state?.courseId,
  //       };

  //       if (!assignmentSubmitted) {
  //         await axios.post(
  //           `/courses/chapters/${assignment.ChapterId}/submission`,
  //           submissionData
  //         );
  //       }
  //       if (submissionStatus === 0) {
  //         setCongratulation(true);
  //         setTimeout(function () {
  //           setCongratulation(false);
  //         }, 3000);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };
  const handleDeleteFile = async (assignmentFileId) => {
    alert(assignmentFileId);
    try {
      const response = await axios.put(
        `/courses/chapters/${location.state?.chapterId}/assignmentfile/${assignmentId}`,
        {
          assignmentFileId: assignmentFileId,
        }
      );
    } catch (error) {
      console.error("Error fetching assignment files:", error);
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
              <div className="body-height flex flex-row gap-5">
                <div className="w-[70%]  px-5 border-r border-slate-300 ">
                  <Box>
                    <Box>
                      <div className="flex justify-between items-center">
                        <Tabs value={value} onChange={handleChange}>
                          <Tab
                            label="Upcoming"
                            {...a11yProps(0)}
                            sx={{ textTransform: "none" }}
                          />
                          <Tab
                            label="Pass due"
                            {...a11yProps(1)}
                            sx={{ textTransform: "none" }}
                          />
                          <Tab
                            label="Completed"
                            {...a11yProps(3)}
                            sx={{ textTransform: "none" }}
                          />
                        </Tabs>
                      </div>
                    </Box>
                    <CustomTabPanel value={value} index={0}></CustomTabPanel>
                  </Box>
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
                        onClick={() => {
                          if (submissionStatus === 1) {
                            handleChangeStatus();
                          } else {
                            handleChangeStatus();
                          }
                        }}
                      >
                        {submissionStatus === 1 ? "Undo Submit" : " Submit"}
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
                        Due in{" "}
                        <span>{formatDateString(assignment?.EndDate)}</span>
                      </dt>
                    </div>
                    <div className="px-2 py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <dt className="text-base 	font-medium leading-6 text-gray-900">
                        <span className="bg-zinc-100 flex max-w-max items-center	 px-3 py-1 rounded-xl">
                          Instructions
                        </span>
                      </dt>
                      <dd className="mt-2  text-base  bg-zinc-100 rounded-md	 text-gray-900 sm:col-span-2 sm:mt-0">
                        <p className="py-2 px-3 italic opacity-90">
                          {assignment?.AssignmentDesc
                            ? getText(assignment?.AssignmentDesc)
                            : "No value"}
                        </p>
                      </dd>
                    </div>
                    <div className=" py-2 ">
                      <dt className="text-base 	font-medium leading-6 text-gray-900">
                        <span className="bg-zinc-100 flex max-w-max items-center	mb-2 px-3 py-1 rounded-xl">
                          Attachments
                        </span>
                      </dt>
                      <dd className="mt-2 text-base  bg-zinc-100 rounded-xl	 text-gray-900 sm:col-span-2 sm:mt-0">
                        <dd className=" text-base	 text-gray-900 sm:col-span-2 sm:mt-0 w-full">
                          {attachFile.length > 0 ? (
                            attachFile.map((file, index) => (
                              <li className="flex items-center justify-between first:pt-3 last:pb-3 py-2 px-3 text-sm leading-4">
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
                                      Download
                                    </a>
                                  </div>
                                </label>
                              </li>
                            ))
                          ) : (
                            <p className="py-2 px-3 italic opacity-90">
                              No value
                            </p>
                          )}
                        </dd>
                      </dd>
                    </div>
                    <div>
                      <p className="font-semibold gap-4 py-2    flex justify-between ">
                        <div className="bg-zinc-100 px-3 py-1 flex items-center rounded-xl justify-center gap-1">
                          <AttachmentIcon />
                          <span>Attach</span>
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
                          Select files
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
                          Review & evaluation
                        </span>
                      </dt>
                      {assignmentSubmitted && (
                        <dd className="mt-2 text-base  bg-zinc-100 rounded-md	 text-gray-900 sm:col-span-2 sm:mt-0">
                          <p className="py-2 px-3 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <div className="flex justify-center gap-3">
                                <CreditScoreIcon />
                                <span className=" font-semibold">Points</span>
                              </div>
                              <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-base font-bold text-red-700 ring-1 ring-inset ring-red-600/10">
                                {assignmentSubmitted?.Score}
                              </span>
                            </div>
                            <div className="flex flex-col items-start">
                              <div className="flex justify-center gap-3">
                                <ReviewsIcon />
                                <span className=" font-semibold">Review </span>
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
