import React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
const ChapterList = ({
  openIndex,
  chapterData,
  lessons,
  handleClick,
  handleToVideo,
  handleToAssignment,
  handleToFile,
}) => {
  return (
    <>
      {chapterData.map((item, index) => (
        <List
          key={index}
          sx={{
            width: "100%",
            maxWidth: 500,
            bgcolor: "#f7f9fa",
            border: "1px solid #dfe3e6",
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={() => handleClick(index, item)}>
            <ListItemText
              primary={`Chương ${index + 1}: ${item.ChapterTitle}`}
            />
            {openIndex === index ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {lessons.map((lesson, lessonIndex) => (
                <ListItemButton
                  key={lessonIndex}
                  sx={{ pl: 4 }}
                  onClick={() => handleToVideo(item.ChapterId, lesson.LessonId)}
                >
                  <ListItemIcon>
                    <OndemandVideoIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={` ${index + 1}.${lessonIndex + 1}:  ${
                      lesson.LessonTitle
                    }`}
                  />
                </ListItemButton>
              ))}
              <ListItemButton
                onClick={() => handleToAssignment(item.ChapterId)}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Bài tập cuối chương" />
              </ListItemButton>
              <ListItemButton onClick={() => handleToFile(item.ChapterId)}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Tài liệu chương học" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      ))}
    </>
  );
};

export default ChapterList;
