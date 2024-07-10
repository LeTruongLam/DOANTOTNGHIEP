import React from "react";
import { formatDateString } from "@/js/TAROHelper";

const StudentResultsTable = ({ studentResults }) => {
  return (
    <div className="p-3">
      <div className="shadow-sm sm:rounded-lg p-4 bg-white">
        <div className="min-h-[480px] max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-sm text-black font-normal">
              <tr className="flex">
                <th scope="col" className="px-6 basis-1/4 py-2" style={{ width: "30%" }}>
                  Họ tên sinh viên
                </th>
                <th scope="col" className="px-6 basis-1/4 py-2" style={{ width: "30%" }}>
                  Mã số sinh viên
                </th>
                <th scope="col" className="px-6 basis-1/4 py-2" style={{ width: "10%" }}>
                  Thời gian nộp bài
                </th>
                <th scope="col" className="px-6 basis-1/4 py-2" style={{ width: "30%" }}>
                  Điểm
                </th>
              </tr>
            </thead>
            <tbody>
              {studentResults?.map((student) => (
                <tr key={student?.AssignmentId} className="bg-white border-t font-medium flex border-slate-300 hover:bg-zinc-100">
                  <td className="px-6 py-3 basis-1/4 truncate">
                    <span title={student?.StudentName}>{student?.StudentName}</span>
                  </td>
                  <td className="px-6 py-3 basis-1/4">{student?.StudentCode}</td>
                  <td className="px-6 py-2 basis-1/4">
                    {student && student.SubmissionTime ? (
                      <>{formatDateString(student?.SubmissionTime)}</>
                    ) : (
                      <div className="text-red-600">Chưa nộp bài</div>
                    )}
                  </td>
                  <td className="px-6 py-3 flex basis-1/4 gap-2">
                    {student && student.Score ? (
                      <>{student?.Score}</>
                    ) : (
                      <>-</>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentResultsTable;
