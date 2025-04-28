import {useState} from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import ImageUploadForm from '../component/form/ImageUploadForm';
import LoadingOverlay from '../component/LoadingOverlay';
import Dialog from '../component/dialog/CustomDialog';
import http from '../utils/http';
import {VerificationResult} from '../types/result-compare.type.ts';
import ResultDisplay from '../component/form/ResultDisplay.tsx';
import {AxiosError} from "axios";

function App() {
    const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([null, null]);
    const [previewUrls, setPreviewUrls] = useState<string[]>(['', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showResultDialog, setShowResultDialog] = useState(false);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

    const handleFileSelect = (file: File | null, index: number) => {
        const newFiles = [...selectedFiles];
        const newPreviews = [...previewUrls];

        newFiles[index] = file;

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                newPreviews[index] = reader.result as string;
                setPreviewUrls(newPreviews);
            };
            reader.readAsDataURL(file);
        } else {
            newPreviews[index] = '';
        }

        setSelectedFiles(newFiles);
        setPreviewUrls(newPreviews);
    };

    const handleReset = () => {
        setSelectedFiles([null, null]);
        setPreviewUrls(['', '']);
        setVerificationResult(null);
        setError('');
        setShowErrorDialog(false);
        setShowResultDialog(false);
    };

    const handleCompare = async () => {
        if (!selectedFiles[0] || !selectedFiles[1]) return;

        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('files', selectedFiles[0]);
            formData.append('files', selectedFiles[1]);

            const response = await http.post('/verify', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });

            if (response.status !== 200) {
                throw new Error(`Server trả lỗi: ${response.status}`);
            }

            const data: VerificationResult = response.data;

            if (typeof data.is_same_person === 'boolean' && typeof data.similarity_score === 'number') {
                setVerificationResult(data);
                setShowResultDialog(true);
            } else {
                throw new Error('Dữ liệu trả về không hợp lệ.');
            }
        } catch (err: unknown) {
            console.error(err);

            if (err instanceof AxiosError) {
                setError(err.response?.data?.detail || 'Đã xảy ra lỗi khi xử lý ảnh. Vui lòng thử lại sau.');
            } else {
                setError('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
            }

            setShowErrorDialog(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header/>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-blue-600 mb-6">
                            So sánh ảnh khuôn mặt ca sĩ
                        </h2>

                        <div className="grid grid-cols-2 gap-8">
                            {[0, 1].map((index) => (
                                <div key={index}>
                                    <ImageUploadForm
                                        onFileSelect={(file) => handleFileSelect(file, index)}
                                        selectedFile={selectedFiles[index]}
                                    />
                                    {previewUrls[index] && (
                                        <div className="mt-4">
                                            <ResultDisplay
                                                imageUrl={previewUrls[index]}
                                                detections={[]} // không cần detection trong bước compare
                                                isSuccess={!!selectedFiles[index]}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-center gap-7">
                            <button
                                type="button"
                                onClick={handleCompare}
                                disabled={!selectedFiles[0] || !selectedFiles[1]}
                                className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                                    selectedFiles[0] && selectedFiles[1]
                                        ? 'bg-indigo-600 hover:bg-indigo-700'
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                So sánh
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-2 ml-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <Dialog
                    isOpen={showErrorDialog}
                    onClose={() => setShowErrorDialog(false)}
                    title="Thông báo"
                    message={error}
                />

                {showResultDialog && verificationResult && (
                    <Dialog
                        isOpen={showResultDialog}
                        onClose={() => setShowResultDialog(false)}
                        title="Kết quả so sánh"
                        message={
                            <>
                                <p>
                                    <strong>Giống nhau:</strong> {verificationResult.is_same_person ? 'Có' : 'Không'}
                                </p>
                                <p>
                                    <strong>Độ tương đồng:</strong> {verificationResult.similarity_score.toFixed(2)}%
                                </p>
                            </>
                        }
                    />
                )}
            </main>

            <Footer/>
            {isLoading && <LoadingOverlay/>}
        </div>
    );
}

export default App;
