import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import ImportData from "../ImportData";
import { message } from "antd";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import StudentTable from "./StudentTable";
import { Import } from "lucide-react";
import { Button } from "@mui/material";

function StudentTab() {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selected, setSelected] = useState();
  const handleReloadClick = () => {
    window.location.reload();
  };
  const handleCheckboxChange = (event) => {
    const id = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:8800/api/accounts/delete/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ids: selectedIds,
        },
      });
      message.success("Xóa tài khoản thành công!");
      setSelectedIds([]);
      fetchStudentAccounts(); // Refresh the student list after deletion
    } catch (error) {
      message.error("Lỗi xóa tài khoản");
      console.error("Error deleting accounts:", error);
    }
  };

  const fetchStudentAccounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/api/accounts/manage-accounts/students"
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching student accounts:", error);
    }
  };

  useEffect(() => {
    fetchStudentAccounts();
  }, []);
  const handleDataUpload = () => {
    console.log(data);
    axios
      .post("http://localhost:8800/api/students", data)
      .then((response) => {
        console.log("Data uploaded successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error uploading data:", error);
      });
  };
  return (
    <div className="rounded-b-lg min-h-[620px] -mx-6 -my-6 bg-[#F5F5F5]">
      <div className="p-3 pb-0 flex justify-between items-center ">
        <div className=" flex justify-center items-center">
          <div
            onClick={handleReloadClick}
            className="hover:bg-slate-200 hover:rounded-md px-1 hover:cursor-pointer"
          >
            <RefreshIcon />
          </div>
          <span className="mx-2 text-slate-500">|</span>
          <span className=" ">Đã chọn {selectedIds.length} mục </span>
          {selectedIds.length !== 0 && (
            <span className="ml-4 px-3 py-2 hover:bg-slate-200  hover:cursor-pointer hover:rounded-md text-blue-700 text-sm">
              Bỏ chọn
            </span>
          )}
        </div>
        <div className="flex justify-between items-center gap-3">
          {selectedIds.length === 0 ? (
            <>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<Import />}
              >
                Nhập dữ liệu
                <ImportData data={data} setData={setData} />
              </Button>
              {data.length > 0 && (
                <button onClick={handleDataUpload}>Upload Data</button>
              )}
            </>
          ) : (
            <div
              onClick={handleDeleteAccount}
              className="flex justify-center items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:rounded-md hover:cursor-pointer"
            >
              <DeleteIcon
                style={{ color: "rgb(220 38 38)", fontSize: "20px" }}
              />
              <span className="text-red-600 text-sm font-semibold">Xóa</span>
            </div>
          )}
        </div>
      </div>
      <StudentTable
        students={students}
        handleCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
}

export default StudentTab;
