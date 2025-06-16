import { useState, useEffect } from 'react';
import http from '../utils/http';
import {Detection} from "../types/detect-face.type.ts";

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

const useFaceDetection = () => {
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
      reader.onload = () => setPreviewUrl(reader.result as string);
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status !== 200) throw new Error(`Lỗi từ server: ${response.status}`);

      const { width: imgWidth, height: imgHeight } = await waitForImageLoad(previewUrl);

      const transformedData: Detection[] = response.data.map(item => {
        const [x1, y1, x2, y2] = item.bounding_box;
        return {
          confidence: item.probability,
          bounding_box: {
            x: x1 / imgWidth,
            y: y1 / imgHeight,
            width: (x2 - x1) / imgWidth,
            height: (y2 - y1) / imgHeight,
          },
          artist: {
            name: item.singer.full_name,
            birth_date: item.singer.birth_date,
            bio: item.singer.biography.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 300) + '...',
            genres: ['Ca sĩ', item.singer.nationality],
            image: item.singer.image_url || undefined,
          },
          singer: {
            songs: item.singer.songs || undefined,
            awards: item.singer.awards || undefined,
          },
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

  return {
    selectedFile,
    previewUrl,
    isLoading,
    detectionResults,
    error,
    isSuccess,
    showDialog,
    handleFileSelect,
    handleSubmit,
    setShowDialog,
  };
};

export default useFaceDetection;
