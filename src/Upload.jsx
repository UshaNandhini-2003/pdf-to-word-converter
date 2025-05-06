import React, { useState } from "react";
import axios from "axios";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import "./Upload.css";

registerPlugin(FilePondPluginFileValidateType);

const Upload = ({
  setUpload,
  setConvert,
  setUploadedFile,
  uploadedFile,
  setShowUpload,
  setShowConvert,
  setShowExport
}) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // Add loading state

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("No file selected");
      return;
    }

    const fileType = files[0].file.type;
    if (fileType !== "application/pdf") {
      alert("Only PDF files are allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0].file);

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You are not logged in. Please log in first.");
      return;
    }

    setIsUploading(true);  // Set loading state

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        setUploadedFile(response.data.file_id);
        alert("PDF upload successful!");
        console.log("Upload successful:", response.data.file_id);
      } else {
        alert(`Upload failed. Status: ${response.status}`);
        console.error("Upload failed with status:", response.status);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);  // Reset loading state
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload PDF for Conversion</h2>
      
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        acceptedFileTypes={["application/pdf"]}
        labelFileTypeNotAllowed="Only PDF files are allowed"
        fileValidateTypeLabelExpectedTypes="Only PDF files are allowed"
        labelIdle='Drag & Drop your PDF file or <span class="filepond--label-action">Browse</span>'
        className="filepond-custom"
      />

      <button 
        className="upload-button" 
        onClick={handleUpload} 
        disabled={isUploading} // Disable button while uploading
      >
        {isUploading ? "Uploading..." : "Upload PDF"}
      </button>

      {uploadedFile && (
        <p className="upload-success">Uploaded File ID: {uploadedFile}</p>
      )}

      <button
        onClick={() => {
          setUpload(false);
          setConvert(false);
          setShowUpload(true);
          setShowConvert(true);
          setShowExport(true);
        }}
        className="upload-button"
      >
        Back
      </button>
    </div>
  );
};

export default Upload;
