import React from "react";
import * as XLSX from "xlsx";
import axios from "axios";
function ImportData({ data, setData }) {
  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  };

  return <input className="hidden" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />;
}

export default ImportData;
