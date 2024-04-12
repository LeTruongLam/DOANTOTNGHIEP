import React, { useState, useEffect } from "react";

function ExamViewDetail() {
  const tabData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    label: (index + 1).toString(),
  }));

  const [activeTab, setActiveTab] = useState(1);
  const [time, setTime] = useState(3600);

  //   useEffect(() => {
  //     let timer = null;
  //     if (time > 0) {
  //       timer = setInterval(() => {
  //         setTime((prevTime) => prevTime - 1);
  //       }, 1000);
  //     }

  //     return () => {
  //       clearInterval(timer);
  //     };
  //   }, [time]);

  const generateTabs = () => {
    return tabData.map((tab) => (
      <li
        key={tab.id}
        className={`rounded-md border border-blue-500 flex ${
          activeTab === tab.id ? "text-white bg-blue-600" : ""
        }`}
      >
        <a
          href="#"
          className="inline-flex items-center justify-center flex-grow px-1 py-2 rounded-md hover:text-gray-900 hover:outline-blue-600 hover:outline"
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </a>
      </li>
    ));
  };
  //   const faqData = [
  //     {
  //       id: 1,
  //       question: "Câu hỏi 1",
  //       answers: [
  //         { text: "Lựa chọn 1", isCorrect: false },
  //         { text: "Lựa chọn 2", isCorrect: true },
  //         { text: "Lựa chọn 3", isCorrect: false },
  //       ],
  //     },
  //     {
  //       id: 2,
  //       question: "Câu hỏi 2",
  //       answers: [
  //         { text: "Lựa chọn A", isCorrect: true },
  //         { text: "Lựa chọn B", isCorrect: false },
  //         { text: "Lựa chọn C", isCorrect: false },
  //       ],
  //     },
  //     {
  //       id: 3,
  //       question: "Câu hỏi 3",
  //       answers: [
  //         { text: "Lựa chọn X", isCorrect: false },
  //         { text: "Lựa chọn Y", isCorrect: false },
  //         { text: "Lựa chọn Z", isCorrect: true },
  //       ],
  //     },
  //     // Thêm các câu hỏi và câu trả lời khác tương tự ở đây
  //     {
  //       id: 4,
  //       question: "Câu hỏi 4",
  //       answers: [
  //         { text: "Lựa chọn M", isCorrect: true },
  //         { text: "Lựa chọn N", isCorrect: false },
  //         { text: "Lựa chọn P", isCorrect: false },
  //       ],
  //     },
  //     {
  //       id: 5,
  //       question: "Câu hỏi 5",
  //       answers: [
  //         { text: "Lựa chọn Q", isCorrect: false },
  //         { text: "Lựa chọn R", isCorrect: true },
  //         { text: "Lựa chọn S", isCorrect: false },
  //       ],
  //     },
  //     {
  //       id: 6,
  //       question: "Câu hỏi 6",
  //       answers: [
  //         { text: "Lựa chọn D", isCorrect: false },
  //         { text: "Lựa chọn E", isCorrect: false },
  //         { text: "Lựa chọn F", isCorrect: true },
  //       ],
  //     },
  //     {
  //       id: 7,
  //       question: "Câu hỏi 7",
  //       answers: [
  //         { text: "Lựa chọn G", isCorrect: false },
  //         { text: "Lựa chọn H", isCorrect: true },
  //         { text: "Lựa chọn I", isCorrect: false },
  //       ],
  //     },
  //     {
  //       id: 8,
  //       question: "Câu hỏi 8",
  //       answers: [
  //         { text: "Lựa chọn J", isCorrect: true },
  //         { text: "Lựa chọn K", isCorrect: false },
  //         { text: "Lựa chọn L", isCorrect: false },
  //       ],
  //     },
  //     {
  //       id: 9,
  //       question: "Câu hỏi 9",
  //       answers: [
  //         { text: "Lựa chọn T", isCorrect: false },
  //         { text: "Lựa chọn U", isCorrect: true },
  //         { text: "Lựa chọn V", isCorrect: false },
  //       ],
  //     },
  //     {
  //       id: 10,
  //       question: "Câu hỏi 10",
  //       answers: [
  //         { text: "Lựa chọn W", isCorrect: true },
  //         { text: "Lựa chọn X", isCorrect: false },
  //         { text: "Lựa chọn Y", isCorrect: false },
  //       ],
  //     },
  //     {
  //       id: 11,
  //       question: "Câu hỏi 11",
  //       answers: [
  //         { text: "Lựa chọn N", isCorrect: false },
  //         { text: "Lựa chọn O", isCorrect: true },
  //         { text: "Lựa chọn P", isCorrect: false },
  //       ],
  //     },
  //     {
  //       id: 12,
  //       question: "Câu hỏi 12",
  //       answers: [
  //         { text: "Lựa chọn Q", isCorrect: true },
  //         { text: "Lựa chọn R", isCorrect: false },
  //         { text: "Lựa chọn S", isCorrect: false },
  //       ],
  //     },
  //     // Thêm các câu hỏi và câu trả lời khác tương tự ở đây
  //     // ...
  //   ];
  //   const generateFAQs = () => {
  //     return faqData.map((faq) => (
  //       <div key={faq.id} className="mb-8">
  //         <h3 className="text-lg font-semibold">{faq.question}</h3>
  //         <ul className="mt-2">
  //           {faq.answers.map((answer, index) => (
  //             <li
  //               key={index}
  //               className={`${
  //                 answer.isCorrect ? "font-bold text-green-500" : ""
  //               }`}
  //             >
  //               {answer.text}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     ));
  //   };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const radios = [
    {
      name: "A",
      description: "For personal or non-commercial projects.",
    },
    {
      name: "B",
      description: "For team collaboration with advanced features.",
    },
    {
      name: "C",
      description: "For teams with security,and performance needs.",
    },
  ];
  return (
    <div className="flex px-5 gap-4 py-5">
      <div className="w-[30%]">
        <div className="sticky top-24  ">
          <ul className="grid py-3 px-2 grid-cols-7 gap-2 text-sm font-medium text-center text-gray-500">
            {generateTabs()}
          </ul>
          <p className="font-semibold mt-3 w-full text-6xl text-center">
            <span className=" px-2 rounded-md border border-blue-500 mr-2">
              {Math.floor(time / 60)
                .toString()
                .padStart(2, "0")}
            </span>
            <span>:</span>
            <span className=" px-2 rounded-md border border-blue-500 mr-2">
              {(time % 60).toString().padStart(2, "0")}
            </span>
          </p>
          <p className="flex justify-center items-center mt-12">
            <button className=" w-max  px-5 py-3 bg-blue-600 rounded-md text-white">
              Submit
            </button>
          </p>
        </div>
      </div>
      <div className="w-[70%] px-10">
        {/* {generateFAQs()} */}
        <div className="text-3xl text-blue-700 font-semibold py-1">
          The Data Science Course: Complete Data Science Bootcamp 2023
        </div>
        <div className="mt-5">
          <ul id="" className="my-4">
            <div className="cau-hoi">
              <span className="text-green-500 font-semibold">
                #ID 14c97994-74ce-4053-b970-55cbabd5b297
              </span>
              <h3 className="font-semibold my-3">
                CRISP-DM là viết tắt của gì?
              </h3>
              <div className="flex justify-center items-center my-3">
                <img
                  src="https://res.cloudinary.com/ddwapzxdc/image/upload/v1712897037/BankQuestion/fdeqtuz5mvppiv93bgch.jpg"
                  alt=""
                  style={{ width: "50%", height: "auto" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 my-3">
                <div className="flex  justify-center items-center gap-5">
                  <input className="w-4 h-4" type="checkbox" id="checkbox1" />
                  <div>
                    <span className="py-3">Checkbox 1</span>
                    <img
                      src="https://res.cloudinary.com/ddwapzxdc/image/upload/v1712897037/BankQuestion/fdeqtuz5mvppiv93bgch.jpg"
                      alt=""
                      style={{ width: "50%", height: "auto" }}
                    />
                  </div>
                </div>
                <div className="flex  justify-center items-center gap-5">
                  <input className="w-4 h-4" type="checkbox" id="checkbox1" />
                  <div>
                    <span className="py-3">Checkbox 1</span>
                    <img
                      src="https://res.cloudinary.com/ddwapzxdc/image/upload/v1712897037/BankQuestion/fdeqtuz5mvppiv93bgch.jpg"
                      alt=""
                      style={{ width: "50%", height: "auto" }}
                    />
                  </div>
                </div>
                <div className="flex  justify-center items-center gap-5">
                  <input className="w-4 h-4" type="checkbox" id="checkbox1" />
                  <div>
                    <span className="py-3">Checkbox 1</span>
                    <img
                      src="https://res.cloudinary.com/ddwapzxdc/image/upload/v1712897037/BankQuestion/fdeqtuz5mvppiv93bgch.jpg"
                      alt=""
                      style={{ width: "50%", height: "auto" }}
                    />
                  </div>
                </div>
                <div className="flex  justify-center items-center gap-5">
                  <input className="w-4 h-4" type="checkbox" id="checkbox1" />
                  <div>
                    <span className="py-3">Checkbox 1</span>
                    <img
                      src="https://res.cloudinary.com/ddwapzxdc/image/upload/v1712897037/BankQuestion/fdeqtuz5mvppiv93bgch.jpg"
                      alt=""
                      style={{ width: "50%", height: "auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ul>

          <ul className="mt-6 grid grid-cols-2 gap-4">
            {radios.map((item, idx) => (
              <li key={idx}>
                <label htmlFor={item.name} className="block relative">
                  <input
                    id={item.name}
                    type="radio"
                    defaultChecked={idx == 1 ? true : false}
                    name="payment"
                    class="sr-only peer"
                  />
                  <div className="w-full p-5 cursor-pointer rounded-lg  border border-slate-300 bg-white shadow-sm ring-indigo-600 peer-checked:ring-2 duration-200">
                    <div className="pl-7">
                      <h3 className="leading-none text-gray-800 font-medium">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="block absolute top-5 left-5 border peer-checked:border-[5px] peer-checked:border-indigo-600 w-4 h-4 rounded-full"></span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ExamViewDetail;
