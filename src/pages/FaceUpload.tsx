import { useState, useEffect } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import ImageUploadForm from '../component/form/ImageUploadForm';
import ResultDisplay from '../component/form/ResultDisplay';
import LoadingOverlay from '../component/LoadingOverlay';
import Dialog from '../component/dialog/CustomDialog';
import http from '../utils/http';
import { Detection} from '../types/detect-face.type.ts';

interface ServerResponse {
  probability: number;
  bounding_box: [number, number, number, number];
  singer: {
    full_name: string;
    birth_date: string;
    biography: string;
    nationality: string;
    image_url: string | null;
    songs?: any[];
    awards?: any[];
  };
}

interface ImageDimensions {
  width: number;
  height: number;
}

function FaceUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detectionResults, setDetectionResults] = useState<Detection[]>([]);
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  useEffect(() => {
    if (selectedFile) {
      setDetectionResults([]);
      setError('');
      setIsSuccess(false);
    }
  }, [selectedFile]);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }
  };

  const waitForImageLoad = (src: string): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError('');
    setDetectionResults([]);
    setIsSuccess(false);

    try {
      const formData = new FormData();
      formData.append('upload_file', selectedFile);

      const response = await http.post<ServerResponse[]>('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) {
        throw new Error(`Lỗi từ server: ${response.status}`);
      }

      const { width: imgWidth, height: imgHeight } = await waitForImageLoad(previewUrl);

      const transformedData: Detection[] = response.data.map(item => {
        const [x1, y1, x2, y2] = item.bounding_box;

        const normalizedX = x1 / imgWidth;
        const normalizedY = y1 / imgHeight;
        const normalizedWidth = (x2 - x1) / imgWidth;
        const normalizedHeight = (y2 - y1) / imgHeight;

        return {
          confidence: item.probability,
          bounding_box: {
            x: normalizedX,
            y: normalizedY,
            width: normalizedWidth,
            height: normalizedHeight
          },
          artist: {
            name: item.singer.full_name,
            birth_date: item.singer.birth_date,
            bio: item.singer.biography.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300) + "...",
            genres: ["Ca sĩ", item.singer.nationality],
            image: item.singer.image_url || undefined // Changed from null to undefined
          },
          singer: {
            songs: item.singer.songs || undefined, // Changed from null to undefined
            awards: item.singer.awards || undefined // Changed from null to undefined
          }
        };
      });

      setDetectionResults(transformedData);
      setIsSuccess(true);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Đã xảy ra lỗi khi xử lý ảnh. Vui lòng thử lại sau.');
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              Nhận diện khuôn mặt ca sĩ
            </h2>
            
            {/* Phần layout mới với 2 cột cố định */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Cột trái: Upload form */}
              <div className="lg:w-1/3 space-y-6">
                <div className="w-full">
                  <ImageUploadForm 
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                  />
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!selectedFile || isLoading}
                    className={`w-full px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out ${
                      selectedFile && !isLoading
                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-400 cursor-not-allowed'
                    } focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50`}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Nhận diện khuôn mặt'}
                  </button>
                </div>
                
                {/* Preview khi chưa có kết quả */}
                {previewUrl && !isSuccess && (
                  <div className="relative mt-4 border rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-auto" 
                    />
                  </div>
                )}
              </div>
              
              {/* Cột phải: Kết quả */}
              <div className="lg:w-2/3">
                {isSuccess && (
                  <div className="relative w-full">
                    <ResultDisplay 
                      imageUrl={previewUrl} 
                      detections={detectionResults} 
                      isSuccess={isSuccess}
                      compactMode={true} 
                    />
                  </div>
                )}
              </div>
            </div>
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