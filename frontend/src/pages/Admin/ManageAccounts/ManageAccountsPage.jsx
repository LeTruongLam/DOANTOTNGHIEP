import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import StudentTab from "./StudentTabs/StudentTab";
import TeacherTab from "./TeacherTabs/TeacherTab";
function ManageAccountsPage() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="">
      <Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange}>
              <Tab label="Sinh viên" value="1" />
              <Tab label="Giáo viên" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <StudentTab />
          </TabPanel>
          <TabPanel value="2">
            <TeacherTab />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default ManageAccountsPage;
