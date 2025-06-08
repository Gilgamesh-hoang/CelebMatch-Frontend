import { useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import ImageUploadForm from '../component/form/ImageUploadForm';
import LoadingOverlay from '../component/LoadingOverlay';
import Dialog from '../component/dialog/CustomDialog';
import http from '../utils/http';
import { AxiosError } from 'axios';

type LookalikeResultItem = {
    singer: {
        full_name: string;
        occupation: string;
        nationality: string;
        birth_date: string;
        residence: string;
        biography: string;
        awards: string;
        songs: string;
    };
    similarity: number;
};


function LookALike() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [, setShowResultDialog] = useState(false);
    const [lookalikeResult, setLookalikeResult] = useState<LookalikeResultItem[]>([]);

    const handleFileSelect = (file: File | null) => {
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl('');
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setLookalikeResult([]);
        setError('');
        setShowErrorDialog(false);
        setShowResultDialog(false);
    };

    const handleCheckLookalike = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('upload_file', selectedFile);

            const response = await http.post('/lookalike', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status !== 200) {
                throw new Error(`Server lỗi: ${response.status}`);
            }

            const data: LookalikeResultItem[] = response.data;
            if (Array.isArray(data) && data.length > 0) {
                setLookalikeResult(data);
                setShowResultDialog(true);
            }
            else {
                throw new Error('Dữ liệu trả về không hợp lệ');
            }
        } catch (err: unknown) {
            console.error(err);

            if (err instanceof AxiosError) {
                setError(err.response?.data?.detail || 'Có lỗi xảy ra. Vui lòng thử lại.');
            } else {
                setError('Lỗi không xác định. Vui lòng thử lại.');
            }

            setShowErrorDialog(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-blue-600 mb-6">
                            Tìm người nổi tiếng giống bạn nhất
                        </h2>

                        <ImageUploadForm
                            onFileSelect={handleFileSelect}
                            selectedFile={selectedFile}
                        />

                        {previewUrl && (
                            <div className="mt-4 text-center">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-48 h-auto mx-auto rounded shadow"
                                />
                                <p className="text-sm text-gray-500 mt-2">Ảnh bạn đã chọn</p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-center gap-7">
                            <button
                                type="button"
                                onClick={handleCheckLookalike}
                                disabled={!selectedFile}
                                className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                                    selectedFile
                                        ? 'bg-indigo-600 hover:bg-indigo-700'
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Tìm người giống bạn
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <Dialog
                    isOpen={showErrorDialog}
                    onClose={() => setShowErrorDialog(false)}
                    title="Lỗi"
                    message={error}
                />

                {lookalikeResult.length > 0 && (
                    <div className="mt-8 space-y-6">
                        {lookalikeResult.map((result, index) => (
                            <div key={index} className="p-6 border rounded-lg shadow bg-white mt-2">
                                <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                                    Kết quả nhận dạng: {result.singer.full_name}
                                </h2>
                                <p><strong>Nghề nghiệp:</strong> {result.singer.occupation}</p>
                                <p><strong>Quốc tịch:</strong> {result.singer.nationality}</p>
                                <p><strong>Ngày sinh:</strong> {result.singer.birth_date}</p>
                                <p><strong>Nơi ở:</strong> {result.singer.residence}</p>
                                <div className="mt-2">
                                    <strong>Tiểu sử:</strong>
                                    <div dangerouslySetInnerHTML={{ __html: result.singer.biography }} />
                                </div>
                                <div className="mt-2">
                                    <strong>Giải thưởng:</strong>
                                    <div dangerouslySetInnerHTML={{ __html: result.singer.awards }} />
                                </div>
                                <div className="mt-2">
                                    <strong>Bài hát nổi bật:</strong>
                                    <div dangerouslySetInnerHTML={{ __html: result.singer.songs }} />
                                </div>
                                <p className="mt-2 text-sm text-red-500">
                                    Mức độ giống: {result.similarity.toFixed(2)}%
                                </p>
                            </div>
                        ))}
                    </div>
                )}

            </main>

            <Footer />
            {isLoading && <LoadingOverlay />}
        </div>
    );
}

export default LookALike;
