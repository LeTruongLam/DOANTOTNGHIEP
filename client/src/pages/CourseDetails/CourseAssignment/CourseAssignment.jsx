import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../course/course.scss";
import ReactQuill from "react-quill";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatDate, getText } from "../../../js/TAROHelper";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Box from "@mui/material/Box";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import NoResultFound from "../../NotFounds/NoResultFound";
export default function CourseAssignment() {
  const location = useLocation();
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const fileInputRef = useRef(null);
  const [assignment, setAssignment] = useState();
  const [assignmentList, setAssignmentList] = useState([]);
  const [attachFile, setAttachFile] = useState([]);

  const handleFileSelect = (event) => {
    // const files = event.target.files;
    const newFile = event.target.files[0];
    // const fileArray = Array.from(files);
    setSelectedFiles(newFile);
    console.log("file: " + newFile);

  };

  const handleChangeClick = () => {
    fileInputRef.current.click();
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const fetchAssignmentData = async () => {
    try {
      const response = await axios.get(
        `/courses/chapters/${location.state?.chapterId}/assignments`
      );
      setAssignment(response.data[0]);
      fetchAssignmentFiles(response.data[0].AssignmentId);
      setAssignmentList(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchAssignmentFiles = async (assignmentId) => {
    try {
      const response = await axios.get(
        `/courses/chapters/${location.state?.chapterId}/assignmentfile/${assignmentId}`
      );
      setAttachFile(response.data);
    } catch (error) {
      console.error("Error fetching assignment files:", error);
    }
  };
  useEffect(() => {
    fetchAssignmentData();
  }, [location.state?.chapterId]);

  const handleNextAssignment = async (assignmentId) => {
    try {
      const chapterId = location.state?.chapterId;
      const response = await axios.get(
        `/courses/chapters/${chapterId}/assignments/${assignmentId}`
      );
      setAssignment(response.data);
      fetchAssignmentFiles(assignmentId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const fileData = new FormData();
      fileData.append("documentSubmit", selectedFiles);
      console.log(selectedFiles);

      console.log(fileData);
      // const requestBody = {
      //   assignmentId: assignment.AssignmentId,
      //   chapterId: location.state?.chapterId,
      //   studentId: currentUser.UserId,
      //   courseId: location.state?.courseId,
      //   fileData: fileData,
      // };

      await axios.post(
        `/users/chapters/uploadAssignmentFile/${assignment.AssignmentId}/submission`,
        fileData
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {assignment ? (
        <div className="course-file-viewer gap-5 ">
          <div className="list-file">
            <List
              sx={{ width: "100%", maxWidth: 350, bgcolor: "background.paper" }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              ref={listRef}
            >
              <ListItemButton component="div" id="nested-list-subheader">
                <Box
                  sx={{
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AssignmentOutlinedIcon />
                  <span onClick={handleToggle}>Upcoming</span>
                </Box>
                {open ? (
                  <ExpandLessIcon onClick={handleToggle} />
                ) : (
                  <ExpandMoreIcon onClick={handleToggle} />
                )}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                {assignmentList.map((assignment, index) => (
                  <ListItemText
                    key={index}
                    onClick={() =>
                      handleNextAssignment(assignment.AssignmentId)
                    }
                  >
                    <div className="flex gap-3 items-center ml-10">
                      <AssessmentOutlinedIcon />
                      <ListItemText primary={assignment.AssignmentTitle} />
                    </div>
                  </ListItemText>
                ))}
              </Collapse>
            </List>
          </div>
          <div className="file-container outline-none mt-5  " tabIndex="0">
            <div className="px-4 sm:px-0 flex justify-between">
              <h3 className="text-2xl font-semibold leading-7 text-gray-900">
                Assignment
              </h3>
              <button onClick={handleSubmit}>Submit</button>
              {/* <MainButton onClick={handleSubmit} content="Submit" /> */}
            </div>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-base	 font-medium leading-6 text-gray-900">
                    Title
                  </dt>
                  <dd className="mt-1 text-base	 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {assignment?.AssignmentTitle}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-base	 font-medium leading-6 text-gray-900">
                    Date
                  </dt>
                  <dd className="mt-1 text-base	 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {assignment?.StartDate ? (
                      <span>{formatDate(assignment?.StartDate)} - </span>
                    ) : (
                      <span>
                        <em>None - </em>
                      </span>
                    )}
                    {assignment?.EndDate ? (
                      <span>{formatDate(assignment?.EndDate)}</span>
                    ) : (
                      <span>
                        <em>None</em>
                      </span>
                    )}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-base	 font-medium leading-6 text-gray-900">
                    About
                  </dt>
                  <dd className="mt-1 text-base	 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {assignment?.AssignmentDesc ? (
                      <span>{getText(assignment?.AssignmentDesc)}</span>
                    ) : (
                      <span>
                        <em>None</em>
                      </span>
                    )}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-base	 font-medium leading-6 text-gray-900">
                    Attachments
                  </dt>
                  <dd className="mt-2 text-base	 text-gray-900 sm:col-span-2 sm:mt-0">
                    <ul
                      role="list"
                      className="divide-y divide-gray-100 rounded-md border border-gray-200"
                    >
                      {attachFile?.length > 0 ? (
                        <>
                          {attachFile?.map((file, index) => (
                            <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
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
                                  className="font-medium  text-indigo-600 hover:text-indigo-500"
                                >
                                  Download
                                </a>
                                <VisibilityIcon className="hover:text-indigo-500 cursor-pointer" />
                              </div>
                            </li>
                          ))}
                        </>
                      ) : (
                        <span>
                          <em>None</em>
                        </span>
                      )}
                    </ul>
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-base	font-medium leading-6 text-gray-900">
                    My work
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
                              <span>Attach</span>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              style={{ display: "none" }}
                              onChange={handleFileSelect}
                            />

                            <button
                              onClick={handleChangeClick}
                              type="button"
                              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                              Select files
                            </button>
                          </p>
                          <div>
                            {selectedFiles && (
                              <>
                                {/* {selectedFiles.map((file, index) => ( */}
                                  <li
                                    // key={index}
                                    className="flex mx-8 border-b border-gray-100 last:border-none	 items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                                  >
                                    <div className="flex w-0 flex-1 items-center">
                                      <PaperClipIcon
                                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                        <span className="truncate font-medium text-blue-500">
                                          {selectedFiles.name}
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                {/* ))} */}
                              </>
                            )}
                          </div>
                        </div>

                        <p className="flex-col">
                          <div className="font-semibold gap-4 py-4 pl-4 pr-5  flex items-center  ">
                            <div className="flex items-center justify-center gap-1">
                              <EditNoteIcon />
                              <span>Note</span>
                            </div>
                          </div>

                          <ReactQuill
                            className="editor bg-main mx-4 mb-4 rounded-xl"
                            theme="snow"
                          />
                        </p>
                      </div>
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[100vh - 60px]">
          <NoResultFound />
        </div>
      )}
    </>
  );
}
