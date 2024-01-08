import React, { useEffect, useState, useRef } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./course.scss";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NoResult from "../../img/noresult.jpg";
export default function CourseFileViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const listRef = useRef(null);
  const handleLogout = () => {
    navigate(location.state.currentPath); // Redirect to "/" after logout
  };
  useEffect(() => {
    const fetchCourseFiles = async () => {
      try {
        const response = await axios.get(
          `/courses/chapters/document/${location.state.chapterId}`
        );
        const documents = response.data.map((item) => ({
          uri: item.DocumentUrl,
          name: item.DocumentName,
        }));
        setDocs(documents);
        setSelectedDoc(documents[0]);
      } catch (error) {
        console.error("Error fetching course files:", error);
      }
    };

    fetchCourseFiles();
  }, [location.state.chapterId]);

  useEffect(() => {
    if (listRef.current) {
      const firstListItem = listRef.current.querySelector("button");
      if (firstListItem) {
        firstListItem.focus();
        firstListItem.classList.add("focused");
      }
    }
  }, [docs]);

  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
  };

  return (
    <div className="course-file-viewer">
      <div className="list-file">
        <List
          ref={listRef}
          sx={{ width: "100%", maxWidth: 350, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {docs.map((data, index) => (
            <ListItemButton
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                marginTop: index === 0 ? 0 : 2,
              }}
              onClick={() => handleDocClick(data)}
            >
              <InsertDriveFileIcon />
              <ListItemText primary={` ${data.name}`} />
            </ListItemButton>
          ))}
        </List>
      </div>
      <div className="file-container" tabIndex="0">
        <div className="navbar">
          <div className="navbar-container">
            <div className="logo">
              <b>{selectedDoc?.name}</b>
            </div>
            <div className="links" onClick={handleLogout}>
              <ExitToAppIcon />
              <span>Exit</span>
            </div>
          </div>
        </div>
        {selectedDoc ? (
          <DocViewer
            documents={[selectedDoc]}
            pluginRenderers={DocViewerRenderers}
            style={{ height: 650 }}
            config={{
              header: {
                disableHeader: false,
                disableFileName: true,
              },
            }}
          />
        ) : (
          <div
            className="empty-docs-message"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={NoResult} alt="" />
          </div>
        )}
      </div>
    </div>
  );
}
