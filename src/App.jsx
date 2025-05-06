import { useState } from 'react';
import UserAccess from './UserAccess.jsx';
import Upload from './Upload.jsx';
import Convert from './Convert.jsx';
import Export from './Export.jsx';
import './UserAccess.css';  

const App = () => {
  const [main, setMain] = useState(true);
  const [upload, setUpload] = useState(false);
  const [convert, setConvert] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const [download,setDownload]=useState(false)
  const [showExport,setShowExport]=useState(true)
  const [format, setFormat] = useState("json");

  return (
    <div className="app-container">
      {main && (
        <UserAccess 
          showUpload={setUpload}
          setShowUpload={setShowUpload}
          showConvert={showConvert}
          setShowConvert={setShowConvert}
          setMain={setMain}
          className="user-access"
        />
      )}
      
      {showUpload && (
        <button 
          className="upload-button"
          onClick={() => {
            setUpload(true);
            setShowConvert(false);
            setShowExport(false) 
          }}
        >
          Upload File
        </button>
      )}

      {upload && (
        <Upload 
          setUpload={setUpload}
          setConvert={setConvert}
          setUploadedFile={setUploadedFile}
          uploadedFile={uploadedFile}
          setShowUpload={setShowUpload}
          setShowConvert={setShowConvert}
          setShowExport={setShowExport}
          className="upload-section"
        />
      )}

      {showConvert && (
        <button 
          className="upload-button"
          onClick={() => {
            setConvert(true);
            setShowUpload(false);
            setShowExport(false)
          }}
        >
          Convert File
        </button>
      )}

      {convert && (
        <Convert 
          uploadedFile={uploadedFile}
          setConvertedFile={setConvertedFile}
          setShowUpload={setShowUpload}
          setShowConvert={setShowConvert}
          setConvert={setConvert}
          setShowExport={setShowExport}
          setFormat={setFormat}
          format={format}
          className="convert-section"
        />
      )}

      {showExport && (
        <button 
          className="upload-button"
          onClick={() => {
            setDownload(true);
            setShowUpload(false);
            setShowConvert(false)
          }}
        >
          Export Option
        </button>
      )}

      {download && (
        <Export 
          fileId={convertedFile}
          setDownload={setDownload}
          setShowUpload={setShowUpload}
          setShowConvert={setShowConvert}
          setShowExport={setShowExport}
          format={format}
          />

        )

      }
    </div>
  );
};

export default App;
