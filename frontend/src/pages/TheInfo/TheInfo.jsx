import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Info.css"; // Import file CSS tùy chỉnh
import { PhotoIcon } from "@heroicons/react/24/solid";
import { formatDateFull } from "@/js/TAROHelper";
import { message } from "antd";

const TheInfo = () => {
  const [info, setInfo] = useState({});
  const [editing, setEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:8800/api/students/personal-infor`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      setInfo(res.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeEdit = () => {
    setEditing(!editing);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("PhoneNo", info.PhoneNo);
    formData.append("BirthDate", formatDateFull(info.BirthDate));
    formData.append("Faculty", info.Faculty);
    formData.append("Adress", info.Adress);

    try {
      await axios.put(
        "http://localhost:8800/api/students/personal-infor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      message.success("Thay đổi thông tin thành công");
      fetchData();
      setEditing(false);
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <div className="mx-[10%] my-10">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="flex justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Hồ sơ
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Thông tin này sẽ được hiển thị công khai nên hãy cẩn thận với
                những gì bạn chia sẻ.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              {editing ? (
                <>
                  <button
                    onClick={handleChangeEdit}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Lưu
                  </button>
                </>
              ) : (
                <button
                  onClick={handleChangeEdit}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sửa
                </button>
              )}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-8">
            <div className="flex flex-col gap-4">
              <div className="">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Họ và tên
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    disabled
                    value={info?.StudentName}
                    className="block flex-1 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 border-0 outline-none"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Mã số sinh viên
                </label>
                <input
                  disabled
                  value={info?.StudentCode}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Ảnh đại diện
              </label>
              {info.Img && !editing ? (
                <img
                  className="max-h-60 w-full object-cover rounded-md"
                  src={info.Img}
                  alt="Avatar"
                />
              ) : (
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex justify-center items-center text-sm leading-6 text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                        <span className="flex justify-center items-center">
                          Tải ảnh lên
                        </span>
                      </label>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      JPG, PNG lên tới 10MB
                    </p>
                    {selectedFile && (
                      <div className="mt-4">
                        <img
                          className="max-h-60 rounded-md"
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Thông tin cá nhân
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
            <div className="">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Địa chỉ email
              </label>
              <input
                disabled
                type="email"
                value={info?.Email}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Năm sinh
              </label>
              <input
                disabled={!editing}
                type="date"
                name="BirthDate"
                value={info.BirthDate ? info.BirthDate.slice(0, 10) : ""}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Địa chỉ thường trú
              </label>
              <input
                disabled={!editing}
                name="Adress"
                value={info?.Adress}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Khoa/ Viện
              </label>
              <input
                disabled={!editing}
                name="Faculty"
                value={info?.Faculty}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Lớp
              </label>
              <input
                disabled={!editing}
                name="Class"
                value={info?.Class}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Số điện thoại
              </label>
              <input
                disabled={!editing}
                name="PhoneNo"
                value={info?.PhoneNo}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheInfo;
