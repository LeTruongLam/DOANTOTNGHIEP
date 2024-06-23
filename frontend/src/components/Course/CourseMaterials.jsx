import React, { useState, useEffect } from "react";
import axios from "axios";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { message, Button, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

export default function CourseMaterials({ title, subTitle, chapterId }) {
  const [documents, setDocuments] = useState([]);
  const [newDocumentFile, setNewDocumentFile] = useState(null);

  useEffect(() => {
    fetchDocument();
  }, [chapterId]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/courses/chapters/document/${chapterId}`
      );
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleSaveClick = async () => {
    if (!newDocumentFile) {
      message.warning("Vui lòng chọn một tập tin trước.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("document", newDocumentFile);
      const response = await axios.post(
        `http://localhost:8800/api/users/uploadDocument/${chapterId}`,
        formData
      );
      message.success("Thêm thành công!");
      fetchDocument();
      setNewDocumentFile(null);
    } catch (error) {
      console.error("Error creating document:", error);
      message.error("Có lỗi xảy ra khi tạo tài liệu");
    }
  };

  const handleDeleteClick = async (documentId) => {
    try {
      await axios.delete(
        `http://localhost:8800/api/courses/chapters/${chapterId}/document/${documentId}`
      );
      setDocuments(documents.filter((doc) => doc.DocumentId !== documentId));
      message.success("Xóa thành công!");
    } catch (error) {
      console.error("Error deleting document:", error);
      message.error("Có lỗi xảy ra khi xóa tài liệu");
    }
  };

  const handleFileChange = (info) => {
    setNewDocumentFile(info.file);
  };

  return (
    <div className="course-title">
      <div className="course-title-wrapper">
        <div className="course-title-header mt-3 mb-3">
          <p>{title}</p>
          <div className="course-title-action">
            <Upload
              name="DocumentFile"
              beforeUpload={() => false}
              onChange={handleFileChange}
              showUploadList={false}
            >
              <Button icon={<InboxOutlined />}>Thêm tài liệu</Button>
            </Upload>
            {newDocumentFile && (
              <Button type="primary" onClick={handleSaveClick}>
                Lưu
              </Button>
            )}
          </div>
        </div>
        <div className="course-title-body">
          {documents.length > 0 ? (
            documents.map((document) => (
              <div className="bg-sub lesson-content" key={document.DocumentId}>
                <div className="lesson-content-left">
                  <DragIndicatorOutlinedIcon />
                  {document?.DocumentName}
                </div>
                <span className="flex items-center gap-2">
                  <DeleteOutlineOutlinedIcon
                    onClick={() => handleDeleteClick(document.DocumentId)}
                  />
                </span>
              </div>
            ))
          ) : (
            <div className="italic text-slate-400">Không có tài liệu</div>
          )}
        </div>
      </div>
    </div>
  );
}
