import { useState, useEffect } from 'react';
import ImageUploadForm from '../component/form/ImageUploadForm';
import ResultDisplay from '../component/form/ResultDisplay';
import LoadingOverlay from '../component/LoadingOverlay';
import Dialog from '../component/dialog/CustomDialog';
import http from '../utils/http';
import { Detection} from '../types/detect-face.type';

interface ServerResponse {
  probability: number;
  bounding_box: [number, number, number, number];
  singer: {
    full_name: string;
    birth_date: string;
    biography: string;
    nationality: string;
    image_url: string | null;
    songs?: string[];
    awards?: string[];
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
            image: item.singer.image_url || undefined,
          },
          singer: {
            songs: item.singer.songs || undefined,
            awards: item.singer.awards || undefined
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-white">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
              Nhận diện khuôn mặt ca sĩ
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 flex flex-col gap-6">
                <ImageUploadForm
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                />

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!selectedFile || isLoading}
                    className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        selectedFile && !isLoading
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                >
                  {isLoading ? 'Đang xử lý...' : 'Nhận diện khuôn mặt'}
                </button>

                {previewUrl && !isSuccess && (
                    <div className="relative mt-4 rounded-xl border shadow-sm overflow-hidden">
                      <img
                          src={previewUrl}
                          alt="Ảnh xem trước"
                          className="w-full h-auto object-contain"
                      />
                    </div>
                )}
              </div>

              <div className="lg:w-2/3">
                {isSuccess && (
                    <ResultDisplay
                        imageUrl={previewUrl}
                        detections={detectionResults}
                        isSuccess={isSuccess}
                        compactMode={true}
                    />
                )}
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

        {isLoading && <LoadingOverlay />}
      </div>
  );

}

export default FaceUpload;