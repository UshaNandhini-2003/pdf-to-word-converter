import React, { useEffect } from "react";
import axios from "axios";
import "./Convert.css";

const Convert = ({
  uploadedFile,
  setConvertedFile,
  setShowConvert,
  setShowUpload,
  setConvert,
  setShowExport,
  setFormat,
  format,
}) => {

  // ✅ Ensure default format is set to DOCX
  useEffect(() => {
    if (!format || format.trim().toUpperCase() !== "DOCX") {
      setFormat("DOCX");
    }
  }, [format, setFormat]);

  const handleConvert = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You are not logged in. Please log in first.");
      return;
    }

    console.log("Uploaded file ID:", uploadedFile);
    console.log("Format selected:", format);
    console.log("Format type:", typeof format);

    if (!uploadedFile) {
      alert("No file selected for conversion.");
      return;
    }

    const cleanedFormat = format?.trim().toUpperCase();
    if (cleanedFormat !== "DOCX") {
      alert(`Unsupported format selected. Received: '${format}'`);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/convert",
        {
          file_id: uploadedFile,
          output_format: "DOCX",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setConvertedFile(response.data.conversion_id);
        alert(`Successfully converted to DOCX`);
      } else {
        alert(`Conversion failed. Backend status: ${response.status}`);
      }
    } catch (error) {
      console.error("Conversion error:", error);
      alert(`Error: ${error.response?.data?.error || "Conversion failed"}`);
    }
  };

  return (
    <div className="convert-container">
      <h2 className="convert-title">Choose Conversion Format</h2>

      <select
        className="convert-select"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
      >
        <option value="DOCX">PDF to DOCX</option>
      </select>

      <button className="upload-button" onClick={handleConvert}>
        Convert
      </button>

      <button
        onClick={() => {
          setShowUpload(true);
          setShowExport(true);
          setShowConvert(true);
          setConvert(false);
        }}
        className="upload-button"
      >
        Back
      </button>
    </div>
  );
};

export default Convert;
