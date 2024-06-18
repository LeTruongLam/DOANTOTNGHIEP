import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { message } from "antd";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdown({ fetchClasses, classId }) {
  const handleDeleteClass = async () => {
    try {
      await axios.delete(
        `http://localhost:8800/api/classes/${classId}`
      );
      message.success("Xóa thành công");
      fetchClasses()
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="p-0 border-none outline-none">
          <MoreVertIcon fontSize={"small"} aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div>
            <Menu.Item className={"m-2 rounded "}>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-blue-100 text-gray-900" : "text-gray-700",
                    "block px-2 py-2 text-base flex gap-2"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span>Add Students</span>
                </div>
              )}
            </Menu.Item>
            <Menu.Item className={"m-2 rounded "}>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-blue-100 text-gray-900" : "text-gray-700",
                    "block px-2 py-2 text-base flex gap-2"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 14 3 L 2 5 L 2 19 L 14 21 L 14 19 L 21 19 C 21.552 19 22 18.552 22 18 L 22 6 C 22 5.448 21.552 5 21 5 L 14 5 L 14 3 z M 12 5.3613281 L 12 18.638672 L 4 17.306641 L 4 6.6933594 L 12 5.3613281 z M 14 7 L 16 7 L 16 9 L 14 9 L 14 7 z M 18 7 L 20 7 L 20 9 L 18 9 L 18 7 z M 5.1757812 8.296875 L 7.0605469 11.994141 L 5 15.703125 L 6.7363281 15.703125 L 7.859375 13.308594 C 7.934375 13.079594 7.9847656 12.908922 8.0097656 12.794922 L 8.0253906 12.794922 C 8.0663906 13.032922 8.1162031 13.202109 8.1582031 13.287109 L 9.2714844 15.701172 L 11 15.701172 L 9.0058594 11.966797 L 10.943359 8.296875 L 9.3222656 8.296875 L 8.2929688 10.494141 C 8.1929688 10.779141 8.1257969 10.998625 8.0917969 11.140625 L 8.0664062 11.140625 C 8.0084063 10.902625 7.9509531 10.692719 7.8769531 10.511719 L 6.953125 8.296875 L 5.1757812 8.296875 z M 14 11 L 16 11 L 16 13 L 14 13 L 14 11 z M 18 11 L 20 11 L 20 13 L 18 13 L 18 11 z M 14 15 L 16 15 L 16 17 L 14 17 L 14 15 z M 18 15 L 20 15 L 20 17 L 18 17 L 18 15 z"></path>
                  </svg>
                  <span>Import Excel</span>
                </div>
              )}
            </Menu.Item>
            <Menu.Item className={"m-2 rounded "}>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-blue-100 text-gray-900" : "text-gray-700",
                    "block px-2 py-2 text-base flex gap-2 cursor-pointer"
                  )}
                  onClick={() => {
                    handleDeleteClass();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z"></path>
                  </svg>
                  <span>Delete</span>
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
