import React, { useState, Fragment, useRef, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import { message } from "antd";
import "../EditWrite.scss";
import PropTypes from "prop-types";

const people = [
  {
    id: 1,
    name: "Select file",
  },
  {
    id: 2,
    name: "URL",
  },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function LessonVideo({ title, subTitle, chapterId, lessonId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const [selected, setSelected] = useState(people[0]);
  const [videoUrl, setVideoUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fetchLessonVideo = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/courses/chapters/${chapterId}/lessons/video/${lessonId}`
      );
      setVideoUrl(res.data.lessonVideo);
    } catch (error) {
      console.error("Error fetching lesson video:", error);
    }
  };
  useEffect(() => {
    fetchLessonVideo();
  }, []);

  const handleVideoUrl = (event) => {
    const selectedFile = event.target.value;
    console.log(selectedFile);
    setVideoUrl(selectedFile);
  };
  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setSelectedFile(newFile);
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      setVideoUrl(newFile);
    }
  };
  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };
  const handleCancelClick = () => {
    setIsEditing(false);
    setFileList([]);
    setSelectedFile(null);
  };
  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      if (videoUrl) {
        if (typeof videoUrl === "string") {
          formData.append("videoUrl", videoUrl);
        } else {
          formData.append("video", videoUrl);
        }
      }
      await axios.put(
        `http://localhost:8800/api/users/${chapterId}/uploadLessonVideo/${lessonId}`,
        formData
      );
      message.success("Video đã được thêm thành công");
      fetchLessonVideo();
    } catch (error) {
      message.error(error.message);
    }
    setIsEditing(false);
  };

  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header  mt-3 mb-3">
          <p>{title}</p>
          {!isEditing ? (
            <div className="course-title-action">
              <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                        <span className="flex items-center">
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
                        <Listbox.Options className="absolute z-50 mt-1 max-h-56  min-w-36  rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                                        active
                                          ? "text-white"
                                          : "text-indigo-600",
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
              <div onClick={handleIconClick}>
                <EditIcon fontSize="small" />
                <span>{subTitle}</span>
              </div>
            </div>
          ) : (
            <div onClick={handleCancelClick} className="course-title-action">
              <span>Cancel</span>
            </div>
          )}
        </div>
        <div className="course-title-body my-8">
          {!isEditing ? (
            videoUrl == null ? (
              <div className="italic text-slate-400		">No lesson video </div>
            ) : (
              <div className="">
                <iframe
                  src={videoUrl}
                  title="Chapter Video"
                  className="rounded-md w-full min-h-60"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )
          ) : (
            <>
              {selected === people[0] && (
                <>
                  <div
                    ref={wrapperRef}
                    className="drop-file-input"
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                  >
                    {selectedFile ? (
                      <div className="selected-file">
                        <video className="" controls>
                          <source
                            src={URL.createObjectURL(selectedFile)}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="drop-file-input__label">
                        <CloudUploadIcon fontSize="large" />
                        <p className="font-normal	">
                          <span className="text-purple-600	">Upload a file</span>
                          <span> or drag and drop </span>
                        </p>
                        <p className="font-light text-sm">MP4 up to 100MB</p>
                      </div>
                    )}
                    <input type="file" value="" onChange={onFileDrop} />
                  </div>
                </>
              )}
              {selected === people[1] && (
                <TextField
                  id="image-url"
                  label="Nhập link video chương học"
                  value={videoUrl}
                  style={{ marginTop: "16px" }}
                  fullWidth
                  onChange={handleVideoUrl}
                />
              )}
              <Button
                sx={{ color: "white", backgroundColor: "black" }}
                style={{
                  marginTop: "12px",
                  width: "max-content",
                }}
                variant="contained"
                onClick={handleSaveClick}
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
LessonVideo.propTypes = {
  onFileChange: PropTypes.func,
};
