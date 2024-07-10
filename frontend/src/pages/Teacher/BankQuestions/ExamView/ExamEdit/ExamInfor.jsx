import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { generateAccessCode, formattedDateTime } from "@/js/TAROHelper";
import React, { useState, Fragment, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { message } from "antd";
function ExamInfor({
  examTitle,
  setExamTitle,
  examDescription,
  setExamDescription,
  startTime,
  setStartTime,
  timeLimit,
  setTimeLimit,
  accessCode,
  setAccessCode,
}) {
  const handlegenerateAccessCode = () => {
    const newAccessCode = generateAccessCode();
    setAccessCode(newAccessCode);
  };

  const handleAccessCodeChange = (event) => {
    setAccessCode(event.target.value);
  };

  return (
    <div>
      <div className="my-3">
        <label
          htmlFor="about"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Tiêu đề bài thi
          <span className="text-red-800 text-xl	">*</span>
        </label>
        <div className="mt-2">
          <textarea
            id="about"
            name="about"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            rows={1}
            className="w-full min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholder="Enter  title "
          />
        </div>
      </div>
      <div className="my-3">
        <label
          htmlFor="about"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Mô tả bài thi
        </label>
        <div className="mt-2">
          <textarea
            id="about"
            name="about"
            rows={1}
            value={examDescription}
            onChange={(e) => setExamDescription(e.target.value)}
            className="w-full min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholder="Enter  description "
          />
        </div>
      </div>
      <div className="my-3">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={["DateTimePicker", "MobileDateTimePicker"]}
          >
            <DemoItem label="Start time">
              <MobileDateTimePicker
                value={startTime}
                onChange={(date) => setStartTime(date)}
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div className="my-3">
        <label
          htmlFor="about"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Thời gian thi
        </label>
        <div className="mt-2 flex items-center justify-start gap-3">
          <input
            type="number"
            min="0"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="max-w-20 min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 text-center"
          />
          <span className="bg-white font-semibold text-gray-700 w-max min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5">
            Phút
          </span>
          <div>
            <span className="text-gray-900 opacity-90 font-semibold text-sm">
              Giới hạn thời gian cho bài kiểm tra này.
              {/* 0 có nghĩa là
            không có giới hạn thời gian. */}
            </span>
          </div>
        </div>
      </div>

      <div className="my-3 flex flex-col">
        <div className=" flex justify-between items-center">
          <label
            htmlFor="about"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Mã truy cập
          </label>
        </div>
        <div className="relative mt-3">
          <input
            type="text"
            value={accessCode}
            onChange={handleAccessCodeChange}
            placeholder="Nhập mã truy cập"
            className="w-full min-h-10  border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
          <button
            className="absolute top-0 right-0 h-full  opacity-50  hover:opacity-100 "
            title="Tạo mã truy cập"
            onClick={handlegenerateAccessCode}
          >
            <AutoAwesomeIcon color="primary" className="" fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamInfor;
