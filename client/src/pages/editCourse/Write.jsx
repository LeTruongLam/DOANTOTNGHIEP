import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
  const location = useLocation();
  const [title, setTitle] = useState(location.state?.title || "");
  const [value, setValue] = useState(location.state?.desc || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(location.state?.cat || "");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterDesc, setChapterDesc] = useState("");
  const [chapterVideo, setChapterVideo] = useState("");
  const [chapterPosition, setChapterPosition] = useState("");
  const navigate = useNavigate();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post("/upload", formData);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const addChapter = async () => {
    try {
      const courseId = location.state.CourseId;
      const response = await axios.post(
        `/courses/${location.state?.CourseId}/chapters`,
        {
          chapterTitle,
          chapterDesc,
          chapterVideo,
          chapterPosition,
          courseId,
        }
      );

      setChapterTitle("");
      setChapterDesc("");
      setChapterVideo("");
      setChapterPosition("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      const updatedTitle = title || location.state?.title;
      const updatedDesc = value || location.state?.desc;
      const updatedCat = cat || location.state?.cat;
      const updatedImg = file ? imgUrl : location.state?.img || "";
      const updatedDate = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

      if (location.state) {
        await axios.put(`/courses/${location.state.CourseId}`, {
          title: updatedTitle,
          desc: updatedDesc,
          cat: updatedCat,
          img: updatedImg,
        });
      } else {
        await axios.post(`/courses/`, {
          title: updatedTitle,
          desc: updatedDesc,
          cat: updatedCat,
          img: updatedImg,
          date: updatedDate,
        });
      }

      await addChapter();

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button>Save as a draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
      </div>
      <div className="chapter">
        <h2>Add Chapter</h2>
        <input
          type="text"
          placeholder="Chapter Title"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
        />
        <textarea
          placeholder="Chapter Description"
          value={chapterDesc}
          onChange={(e) => setChapterDesc(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Chapter Video URL"
          value={chapterVideo}
          onChange={(e) => setChapterVideo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Chapter Position"
          value={chapterPosition}
          onChange={(e) => setChapterPosition(e.target.value)}
        />
        <button onClick={addChapter}>Add Chapter</button>
      </div>
    </div>
  );
};

export default Write;