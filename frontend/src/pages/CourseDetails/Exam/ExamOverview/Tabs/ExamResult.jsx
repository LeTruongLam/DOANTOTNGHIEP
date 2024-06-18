import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { AlarmClockCheck, BookCheck, BookText, Check, Medal, Sigma } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router";
import { formatDateString } from "../../../../../js/TAROHelper";
const COLORS = ["#0088FE", "#00C49F"];

function ExamResult({ examResult }) {
  const { examId } = useParams();

  const data = [
    { name: "Đúng", value: examResult?.NumberCorrectAnswers },
    {
      name: "Sai",
      value: examResult?.NumberQuestions - examResult?.NumberCorrectAnswers,
    },
  ];
  const calculatePercentage = (value, total) => {
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  return (
    <div className=" ">
      <div className="">
        {examResult && (
          <div className="flex gap-3">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx={120}
                cy={200}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value, percent }) =>
                  `${name}: ${calculatePercentage(
                    value,
                    data.reduce((sum, entry) => sum + entry.value, 0)
                  )}`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <div className="flex-grow my-auto">
              <div className="flex justify-between w-full rounded-md p-3 my-3 bg-[#7BACA9]">
                <div className="flex gap-2 justify-center items-center text-white font-semibold">
                  <AlarmClockCheck />
                  <div>Thời gian nộp</div>
                </div>
                <div className="text-white font-semibold">
                  {formatDateString(examResult?.SubmissionTime)}
                </div>
              </div>
              <div className="flex justify-between w-full rounded-md p-3 my-3 bg-[#D9D9D9]">
                <div className="flex gap-2 justify-center items-center text-black font-semibold">
                  <Sigma />
                  <div>Tổng số câu hỏi</div>
                </div>
                <div className="text-black font-semibold">
                  {examResult?.NumberQuestions}
                </div>
              </div>
              <div className="flex justify-between w-full rounded-md p-3 my-3 bg-[#7BACA9]">
                <div className="flex gap-2 justify-center items-center text-white font-semibold">
                  <BookText  />
                  <div>Số câu đã trả lời</div>
                </div>
                <div className="text-white font-semibold">
                  {examResult?.NumberAnswers}
                </div>
              </div>
              <div className="flex justify-between w-full rounded-md p-3 my-3 bg-[#D9D9D9]">
                <div className="flex gap-2 justify-center items-center text-black font-semibold">
                  <Check /> <div>Số câu đúng</div>
                </div>
                <div className="text-black font-semibold">
                  {examResult?.NumberCorrectAnswers}
                </div>
              </div>
              <div className="flex justify-between w-full rounded-md p-3 my-3 bg-[#7BACA9]">
                <div className="flex gap-2 justify-center items-center text-white font-semibold">
                  <Medal /> <div>Kết quả</div>
                </div>
                <div className="text-white bg-red-600 px-2 rounded-lg font-semibold">
                  {examResult?.Score}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamResult;
