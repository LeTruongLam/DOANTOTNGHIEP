import StudentTableRow from "./StudentTableRow";

const StudentTable = ({ students, handleCheckboxChange }) => (
  <div className="p-3">
    <div className="shadow-sm sm:rounded-lg p-4 bg-white">
      <div className="min-h-[480px] max-h-[500px] overflow-y-auto">
        {students && students.length > 0 ? (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-sm text-black font-normal">
              <tr>
                <th scope="col" className="p-4 w-[5%] h-4">#</th>
                <th scope="col" className="px-6 py-2 w-[10%]">
                  Tên tài khoản
                </th>
                <th scope="col" className="px-6 py-2 w-[20%]">
                  Email
                </th>
                <th scope="col" className="px-6 py-2 w-[15%]">
                  Mật khẩu
                </th>
                <th scope="col" className="px-6 py-2 w-[20%]">
                  Họ tên sinh viên
                </th>
                <th scope="col" className="px-6 py-2 w-[20%]">
                  Mã số sinh viên
                </th>
                <th scope="col" className="px-6 py-2 w-[10%]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <StudentTableRow
                  key={student.UserId}
                  student={student}
                  handleCheckboxChange={handleCheckboxChange}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex gap-6 flex-col justify-center items-center w-full min-h-[480px] max-h-[500px]">
            No student accounts found.
          </div>
        )}
      </div>
    </div>
  </div>
);

export default StudentTable;