import React, { useEffect, useState, useRef } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./course.scss";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import NoResultFound from "../NotFounds/NoResultFound";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
export default function CourseFileViewer() {
  const location = useLocation();
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const listRef = useRef(null);
  useEffect(() => {
    const fetchCourseFiles = async () => {
      try {
        const response = await axios.get(
          `/courses/chapters/document/${location.state?.chapterId}`
        );
        setLoading(false);

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
  }, [location.state?.chapterId]);

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
    <>
      {loading ? (
        <>
          <Backdrop
            sx={{
              color: "rgba(0, 0, 0, 0.8)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <>
          {!selectedDoc ? (
            <NoResultFound />
          ) : (
            <div className="course-file-viewer">
              <div className="list-file">
                <List
                  ref={listRef}
                  sx={{
                    width: "100%",
                    maxWidth: 250,
                    bgcolor: "background.paper",
                  }}
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
                      <ListItemText
                        className="truncate"
                        primary={` ${data.name}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </div>
              <div className="file-container" tabIndex="0">
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
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
