import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ExamResult from "./Tabs/ExamResult";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ExamDescription from "./Tabs/ExamDescription";
function ExamOverview() {
  const [value, setValue] = React.useState(0);

  const { examId } = useParams();
  const [exam, setExam] = useState();
  const [examResult, setExamResult] = useState();
  const navigate = useNavigate();

  const fetchExamOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8800/api/questions/exam/${examId}/overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExam(response.data[0]);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchExamResult = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8800/api/questions/exam/${examId}/results`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExamResult(response.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchExamOverview();
  }, [examId]);
  useEffect(() => {
    fetchExamResult();
  }, [examId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  return (
    <div className="flex flex-col h-container-main py-5 px-[15%] ">
      <span
        className="text-gray-900 mb-3  w-max px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 hover:cursor-pointer text-sm font-medium opacity-85"
        onClick={() => {
          navigate(-1);
        }}
      >
        Quay lại
      </span>
      <div>
        <h2 className=" font-semibold text-blue-500 text-3xl">{exam?.title}</h2>
        <h3 className=" font-semibold text-center py-3 text-2xl">
          {exam?.ExamTitle}
        </h3>
      </div>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: "12px 12px 0 0 ",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label="Tổng quan"
              {...a11yProps(0)}
              className="border-none outline-none focus:outline-none focus-visible:outline-none"
              sx={{
                textTransform: "none",

                "&.Mui-selected": {
                  backgroundColor: "#F5F5F5", // Thay đổi màu nền của tab được chọn ở đây
                },
              }}
            />
            <Tab
              label="Kết quả"
              {...a11yProps(1)}
              className="border-none outline-none focus:outline-none focus-visible:outline-none"
              sx={{
                textTransform: "none",

                "&.Mui-selected": {
                  backgroundColor: "#F5F5F5", // Thay đổi màu nền của tab được chọn ở đây
                },
              }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <ExamDescription exam={exam} examResult={examResult} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ExamResult examResult={examResult} />
        </CustomTabPanel>
      </Box>
    </div>
  );
}

export default ExamOverview;
