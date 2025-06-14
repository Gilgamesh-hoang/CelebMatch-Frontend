import { Alert, Button, Modal } from 'antd';
import LoadingOverlay from '../component/LoadingOverlay';
import { useImageComparison } from '../hooks/useImageComparison';
import ImageUploadForm from "../component/form/ImageUploadForm.tsx";

function CompareImage() {
    const {
        selectedFiles,
        previewUrls,
        isLoading,
        error,
        showErrorDialog,
        showResultDialog,
        verificationResult,
        handleFileSelect,
        handleReset,
        handleCompare,
        setShowErrorDialog,
        setShowResultDialog,
    } = useImageComparison();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                            So sánh ảnh khuôn mặt ca sĩ
                        </h2>

                        <div className="grid grid-cols-2 gap-8 justify-items-center">

                        {[0, 1].map((index) => (
                                <div key={index} className="space-y-4 flex flex-col items-center">
                                    <ImageUploadForm
                                        onFileSelect={(file) => handleFileSelect(file, index)}
                                        selectedFile={selectedFiles[index]}
                                    />

                                    {previewUrls[index] && (
                                        <div className="w-[220px] h-[220px] border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={previewUrls[index]}
                                                alt={`Ảnh ${index + 1}`}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Button
                                type="primary"
                                onClick={handleCompare}
                                disabled={!selectedFiles[0] || !selectedFiles[1]}
                                loading={isLoading}
                                className={`px-6 py-2 rounded-lg text-white font-semibold transition ${selectedFiles[0] && selectedFiles[1]
                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                So sánh
                            </Button>

                            <Button
                                onClick={handleReset}
                                className="ml-6 px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                            >
                                Làm mới
                            </Button>
                        </div>

                    </div>
                </div>

                <Modal
                    title="Thông báo lỗi"
                    open={showErrorDialog}
                    onCancel={() => setShowErrorDialog(false)}
                    footer={null}
                >
                    <Alert message={error} type="error" showIcon />
                </Modal>

                {showResultDialog && verificationResult && (
                    <Modal
                        title="Kết quả so sánh"
                        open={showResultDialog}
                        onCancel={() => setShowResultDialog(false)}
                        footer={null}
                    >
                        <p>
                            <strong>Giống nhau:</strong> {verificationResult.is_same_person ? 'Có' : 'Không'}
                        </p>
                        <p>
                            <strong>Độ tương đồng:</strong>{' '}
                            {(verificationResult.similarity_score * 100).toFixed(2)}%
                        </p>
                    </Modal>
                )}
            </main>

            {isLoading && <LoadingOverlay />}
        </div>
    );
}

export default CompareImage;
