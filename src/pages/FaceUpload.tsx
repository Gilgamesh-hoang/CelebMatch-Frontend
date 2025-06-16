import {useEffect, useState} from 'react';
import ImageUploadForm from '../component/form/ImageUploadForm';
import ResultDisplay from '../component/form/ResultDisplay';
import LoadingOverlay from '../component/LoadingOverlay';
import http from '../utils/http';
import {Detection} from '../types/detect-face.type';
import {Alert, Modal} from "antd";

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
            img.onload = () => resolve({width: img.width, height: img.height});
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

            const {width: imgWidth, height: imgHeight} = await waitForImageLoad(previewUrl);

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
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                        Nhận diện khuôn mặt ca sĩ
                    </h2>


                            <ImageUploadForm
                                onFileSelect={handleFileSelect}
                                selectedFile={selectedFile}
                            />

                        <div className="mt-6 flex justify-center">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!selectedFile}
                                className={`px-6 py-2 rounded-lg text-white font-semibold transition ${selectedFile
                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Nhận diện khuôn mặt
                            </button>

                            <button
                                type="button"
                                onClick={() => {}}
                                className="ml-6 px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                            >
                                Làm mới
                            </button>
                        </div>

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
                </div>
                <div className="w-full flex justify-center mt-6">
                    {isSuccess && (
                        <ResultDisplay
                            imageUrl={previewUrl}
                            detections={detectionResults}
                            isSuccess={isSuccess}
                            compactMode={true}
                        />
                    )}
                </div>
                <Modal
                    open={showDialog}
                    onCancel={() => setShowDialog(false)}
                    onOk={() => setShowDialog(false)}
                    title="Lỗi"
                    footer={null}
                    centered
                >
                    <Alert message={error} type="error" showIcon />
                    <div className="text-right mt-4">
                        <button
                            onClick={() => setShowDialog(false)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            OK
                        </button>
                    </div>
                </Modal>

            </main>

            {isLoading && <LoadingOverlay/>}
        </div>
    );

}

export default FaceUpload;