import { useState } from 'react';
import axios from 'axios';
import './Export.css';

const Export = ({
    fileId,
    setShowUpload,
    setShowConvert,
    setShowExport,
    setDownload,
}) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!fileId) {
            alert("No file to export.");
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Please log in first.");
            return;
        }

        try {
            setDownloading(true);
            const response = await axios.post(
                'http://127.0.0.1:5000/api/export',
                { conversion_id: fileId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob',
                }
            );

            if (response.status === 200) {
                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `exported-file.docx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert("Failed to download file.");
            }
        } catch (error) {
            console.error("Download failed:", error);
            alert("Error occurred while downloading.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="export-container">
            <h2 className="export-title">Download Converted File (.docx)</h2>
            <button
                className="download-link"
                onClick={handleDownload}
                disabled={downloading}
            >
                {downloading ? 'Downloading...' : 'Download DOCX'}
            </button>

            <button
                className="back-button"
                onClick={() => {
                    setShowExport(true);
                    setShowUpload(true);
                    setShowConvert(true);
                    setDownload(false);
                }}
            >
                Back
            </button>
        </div>
    );
};

export default Export;
