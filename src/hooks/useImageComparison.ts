import { useState } from 'react';
import { VerificationResult } from '../types/result-compare.type';
import http from '../utils/http';
import { AxiosError } from 'axios';

export function useImageComparison() {
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
        setPreviewUrls([...newPreviews]);
      };
      reader.readAsDataURL(file);
    } else {
      newPreviews[index] = '';
      setPreviewUrls([...newPreviews]);
    }

    setSelectedFiles(newFiles);
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
        headers: { 'Content-Type': 'multipart/form-data' },
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

  return {
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
  };
}
