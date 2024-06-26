import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ViewAEditDropdown({ examId }) {
  const { fetchExamById } = useContext(AuthContext);

  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleViewExam = () => {
    fetchExamById(examId);
    navigate(`/teacher/courses/${courseId}/exams/${examId}`);
  };

  const handleEditExam = () => {
    // Handle edit logic
  };

  const handleDeleteExam = () => {
    // Handle delete logic
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 text-sm font-semibold text-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 hover:cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleViewExam}
                  className={classNames(
                    active ? "bg-blue-700 text-white" : "text-gray-700",
                    "block px-4 py-2 text-sm w-full font-semibold text-left" // Thêm lớp CSS text-left
                  )}
                >
                  View
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleEditExam}
                  className={classNames(
                    active ? "bg-blue-700 text-white" : "text-gray-700",
                    "block px-4 py-2 text-sm w-full font-semibold text-left" // Thêm lớp CSS text-left
                  )}
                >
                  Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleDeleteExam}
                  className={classNames(
                    active ? "bg-blue-700 text-white" : "text-gray-700",
                    "block px-4 py-2 text-sm w-full font-semibold text-left" // Thêm lớp CSS text-left
                  )}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
