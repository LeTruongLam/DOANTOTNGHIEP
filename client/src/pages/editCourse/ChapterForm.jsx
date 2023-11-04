import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";


const ChapterForm = () => {
 
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    setSelectedVideo(file);
    setPreviewVideo(URL.createObjectURL(file));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (selectedVideo) {
      const formData = new FormData();
      formData.append("video", selectedVideo);

      axios
        .post("/users/uploadVideo", formData)
        .then((response) => {
          const data = response.data;
          if (data.success) {
            // Upload successful
            const videoURL = data.data.url;
            alert("Video URL:", videoURL);
          } else {
            // Upload failed
            console.log("Error:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="container">
      <div className="body">
        <div className="content">
          <div className="info-title">
            <h2>Thông tin cá nhân</h2>
            {!editing && (
              <button className="btn btn-primary" onClick={handleEdit}>
                Sửa thông tin
              </button>
            )}
          </div>
          <div className="user-info">
            {info.map((uInfo) => (
              <div className="card" key={uInfo.id}>
                <div className="card-body">
                  {editing ? (
                    <>
                      <h5 className="card-title">{uInfo.StudentName}</h5>
                      <p className="card-text">{uInfo.Class}</p>
                      <p className="card-text">{uInfo.Faculty}</p>
                      <input
                        type="text"
                        value={uInfo.Email}
                        onChange={(e) =>
                          setInfo([
                            {
                              ...uInfo,
                              Email: e.target.value,
                            },
                          ])
                        }
                      />
                      <p className="card-text">{formatDate(uInfo.BirthDate)}</p>
                      <input
                        type="text"
                        value={uInfo.PhoneNo}
                        onChange={(e) =>
                          setInfo([
                            {
                              ...uInfo,
                              PhoneNo: e.target.value,
                            },
                          ])
                        }
                      />
                      <button className="btn btn-primary" onClick={handleSave}>
                        Lưu
                      </button>
                    </>
                  ) : (
                    <>
                      <h5 className="card-title">{uInfo.StudentName}</h5>
                      <p className="card-text">{uInfo.Class}</p>
                      <p className="card-text">{uInfo.Faculty}</p>
                      <p className="card-text">{uInfo.Email}</p>
                      <p className="card-text">{formatDate(uInfo.BirthDate)}</p>
                      <p className="card-text">{uInfo.PhoneNo}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h1>Video Upload</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            type="file"
            onChange={handleVideoChange}
            accept="video/*"
            required
          />
          <button type="submit">Upload</button>
        </form>
        {previewVideo && (
          <video controls width="640" height="480">
            <source src={previewVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default ChapterForm;
