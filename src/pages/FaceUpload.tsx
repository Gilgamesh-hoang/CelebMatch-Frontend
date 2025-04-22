import { useState, useRef, useEffect } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import ImageUploadForm from '../component/form/ImageUploadForm';
import ResultDisplay from '../component/form/ResultDisplay';
import LoadingOverlay from '../component/LoadingOverlay';
import Dialog from '../component/dialog/CustomDialog';
import http from '../utils/http'; 

function FaceUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectionResults, setDetectionResults] = useState([]);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Reset results when new file is selected
  useEffect(() => {
    if (selectedFile) {
      setDetectionResults([]);
      setError('');
      setIsSuccess(false);
    }
  }, [selectedFile]);

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('upload_file', selectedFile);

      const response = await http.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Server trả về lỗi: ${response.status}`);
      }

      const data = await response.json();
      setDetectionResults(data);
      setIsSuccess(true);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Đã xảy ra lỗi khi xử lý ảnh. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Nhận diện khuôn mặt ca sĩ
          </h2>
          <div className="flex flex-grow gap-6">
            <div className="w-[320px] h-[250px] shrink-0">
              <ImageUploadForm 
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            </div>

            <div className="flex-1">
              {previewUrl && (
                <div className="relative mt-0">
                  <ResultDisplay 
                    imageUrl={previewUrl} 
                    detections={detectionResults}
                    isSuccess={isSuccess}
                  />
                </div>
              )}
            </div>
          </div>
          </div>
          <div className="flex justify-center p-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedFile}
              className={`px-8 py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform ${
                selectedFile
                  ? 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
              } focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50`}
            >
              Nhận diện khuôn mặt
            </button>
          </div>

        </div>
          <Dialog
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
            title="Thông báo"
            message={error}
          />
      </main>

      <Footer />
      
      {isLoading && <LoadingOverlay />}
    </div>
  );
}

export default FaceUpload;
