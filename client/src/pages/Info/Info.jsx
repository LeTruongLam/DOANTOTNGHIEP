import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Info.scss"; // Import file CSS tùy chỉnh
const formatDate = (dateString) => {
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

const Info = () => {
  const [info, setInfo] = useState([]);
  const [editing, setEditing] = useState(false);
  const cat = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/infor${cat}`);
        setInfo(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedInfo = {
        Email: info[0].Email,
        PhoneNo: info[0].PhoneNo,
      };
      await axios.put(`/students${cat}`, updatedInfo);
      const res = await axios.get(`/students${cat}`);
      setInfo(res.data);
      setEditing(false);
    } catch (err) {
      console.log(err);
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

    </div>
  );
};

export default Info;
