import React, { useState, useEffect } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import axios from "axios";

function QuestionsList({ chapters, questionList, setQuestionList }) {
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(0);

  useEffect(() => {
    const fetchQuestionListByChapterId = async (chapterId) => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`/questions/chapters/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        setQuestionData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (expandedChapter !== null) {
      fetchQuestionListByChapterId(chapters[expandedChapter]?.ChapterId);
    }
  }, [expandedChapter]);

  const toggleDropdown = (index) => {
    if (expandedChapter === index) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(index);
    }
  };

  const handleCheckboxChange = (event, question) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setQuestionList((prevQuestionList) => [
        ...prevQuestionList,
        question.QuestionId,
      ]);
    } else {
      setQuestionList((prevQuestionList) =>
        prevQuestionList.filter((q) => q !== question.QuestionId)
      );
    }
  };

  const handleSelectQuestions = () => {
    const shuffledQuestions = questionData.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, selectedQuestionCount);
    const selectedQuestionIds = selectedQuestions.map(
      (question) => question.QuestionId
    );
    setQuestionList(selectedQuestionIds);
  };

  return (
    <div className="w-full my-2">
      {chapters.map((chapter, index) => (
        <div className="relative" key={index}>
          <p
            id={`dropdownCheckboxButton-${index}`}
            className="w-full  justify-between min-w-96 my-2 text-gray-800 focus:ring-1 border border-blue-300 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-2.5 py-2.5 text-center inline-flex items-center "
            onClick={() => {
              toggleDropdown(index);
              console.log(chapter.ChapterId);
            }}
          >
            {chapter?.ChapterTitle}
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </p>
          {expandedChapter === index && (
            <div
              className="top-full left-0 z-10 w-full bg-white divide-y divide-slate-200 px-3 rounded-lg shadow"
              aria-labelledby={`dropdownCheckboxButton-${index}`}
            >
              <ul className="p-3 space-y-3 text-sm text-gray-700">
                {questionData.map((data, index) => (
                  <li key={index}>
                    <div className="flex items-center">
                      <input
                        id={`checkbox-item-${index}`}
                        type="checkbox"
                        value=""
                        checked={questionList.includes(data.QuestionId)}
                        onChange={(event) => handleCheckboxChange(event, data)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                      />
                      <label
                        htmlFor={`checkbox-item-${index}`}
                        className="ms-2 text-sm font-medium text-gray-900"
                      >
                        {data?.QuestionContent}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="py-3">
                <label
                  htmlFor="questionCountInput"
                  className="block mb-1  text-sm font-medium text-gray-900"
                >
                  Choose questions at random:
                </label>
                <div className="flex justify-between items-center">
                  <input
                    id="questionCountInput"
                    type="number"
                    value={selectedQuestionCount}
                    min={0}
                    onChange={(event) =>
                      setSelectedQuestionCount(Number(event.target.value))
                    }
                    className="max-w-20 min-h-10 border border-blue-300 text-black text-sm rounded-md focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 text-center"
                  />
                  <button
                    onClick={handleSelectQuestions}
                    className=" flex justify-center items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    <AutoAwesomeIcon fontSize="small" />
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default QuestionsList;
