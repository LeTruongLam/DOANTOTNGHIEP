import React, { useEffect } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { message } from "antd";
import {
  formatDateFull,
  formattedDateTime,
} from "../../../../../js/TAROHelper";
import Completed from "../../../../../img/completed.png";
import { useNavigate, useParams } from "react-router-dom";
function ShowDialog({
  title,
  value,
  handleInputChange,
  handleOke,
  open,
  setOpen,
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="mt-3 text-center  sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2 w-full">
                      <div className="w-full">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Mã truy cập
                        </label>
                        <div className="mt-2 w-full">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={value}
                            onChange={handleInputChange}
                            required
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
                      handleOke();
                    }}
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm  hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function ExamDescription({ exam, examResult }) {
  const [open, setOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [currentTime, setCurrentTime] = useState(formattedDateTime(new Date()));
  const timeStart = formatDateFull(exam?.TimeStart);
  const timeStartDate = new Date(timeStart);

  const AccessTimedOut = formatDateFull(
    new Date(timeStartDate.getTime() + 30 * 60 * 1000)
  );
  console.log("end:", AccessTimedOut);

  const isExamStarted =
    currentTime >= timeStart && currentTime <= AccessTimedOut;
  const navigate = useNavigate();
  const { courseId, examId } = useParams();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formattedDateTime(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const handleInputChange = (event) => {
    setAccessCode(event.target.value);
  };
  const handleOke = () => {
    if (accessCode === exam.AccessCode) {
      message.success("Truy cập thành công!");
      localStorage.setItem("startExam", 1);

      navigate(`/course/${courseId}/exams/${examId}`);
    } else {
      message.error("Mã truy cập không hợp lệ");
    }
  };
  const handleStartExam = () => {
    if (exam.ConfirmAccess) {
      setOpen(true);
    } else {
      navigate(`/course/${courseId}/exams/${examId}`);
      localStorage.setItem("startExam", 1);
    }
  };
  return (
    <div>
      <div className="px-4 sm:px-0 mt-5">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Thông tin bài thi
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Đây là thông tin chi tiết về bài thi bạn sắp tham gia. Chọn bắt đầu để
          bắt đầu làm bài thi
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Thời gian bắt đầu
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatDateFull(exam?.TimeStart)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Mô tả
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {exam?.ExamDescription}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Số câu hỏi
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {exam?.QuestionCount}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Thời gian làm bài
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {exam?.TimeLimit} phút
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex justify-end items-center">
        {!examResult ? (
          <button
            disabled={!isExamStarted}
            onClick={() => {
              handleStartExam();
            }}
            className="font-medium bg-indigo-600 text-white focus:outline-none disabled:opacity-20 disabled:cursor-no-drop"
          >
            Bắt đầu
          </button>
        ) : (
          <img className=" h-10" src={Completed} alt="" />
        )}
      </div>
      <ShowDialog
        title="Nhập mã truy cập"
        value={accessCode}
        handleInputChange={handleInputChange}
        open={open}
        handleOke={handleOke}
        setOpen={setOpen}
      />
    </div>
  );
}

export default ExamDescription;
