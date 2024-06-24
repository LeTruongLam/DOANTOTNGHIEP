const StudentTableRow = ({ student, handleCheckboxChange }) => (
  <tr
    key={student.UserId}
    className="bg-white border-t border-slate-300 hover:bg-zinc-100"
  >
    <td className="w-[5%] p-3">
      <div className="flex items-center">
        <input
          id={student.UserId}
          onChange={(event) => handleCheckboxChange(event, student)}
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          value={student.UserId}
        />
      </div>
    </td>
    <td className="px-6 py-3 w-[10%] truncate">
      <span title={student.UserName}>{student.UserName}</span>
    </td>
    <td className="px-6 py-3 w-[20%] truncate">
      <span title={student.Email}>{student.Email}</span>
    </td>
    <td className="px-6 py-3 w-[15%] max-w-24 overflow-hidden truncate">
      <span title={student.Password}>{student.Password}</span>
    </td>
    <td className="px-6 py-3 w-[20%] truncate">
      <span title={student.StudentName}>{student.StudentName}</span>
    </td>
    <td className="px-6 py-3 w-[20%] truncate">
      <span title={student.StudentCode}>{student.StudentCode}</span>
    </td>
    <td className="px-6 py-3 w-[10%] text-center">
      <button className="font-medium text-blue-600 hover:underline">Sửa</button>
    </td>
  </tr>
);

export default StudentTableRow;