import { useEffect, useRef, useState } from 'react';
import { Detection, BoundingBox } from '../../types/detect-face';  
interface ResultDisplayProps {
  imageUrl: string;
  detections?: Detection[];
  isSuccess?: boolean;
  compactMode?: boolean;  
}
const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, detections, isSuccess }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Theo dõi khi ảnh tải và cập nhật state
  useEffect(() => {
    if (imgRef.current) {
      const img = imgRef.current;
      
      if (img.complete) {
        // Nếu ảnh đã tải xong (từ cache)
        setImageLoaded(true);
        updateContainerSize();
      } else {
        // Gán sự kiện onload cho ảnh mới
        img.onload = () => {
          setImageLoaded(true);
          updateContainerSize();
          console.log("Image loaded with dimensions:", img.naturalWidth, "x", img.naturalHeight);
        };
      }
    }
    
    // Cleanup function
    return () => {
      if (imgRef.current) {
        imgRef.current.onload = null;
      }
    };
  }, [imageUrl]);

  // Cập nhật kích thước container khi cửa sổ thay đổi
  useEffect(() => {
    window.addEventListener('resize', updateContainerSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);

  // Xử lý cập nhật khi detections thay đổi
  useEffect(() => {
    if (imageLoaded && detections) {
      updateContainerSize();
    }
  }, [detections, imageLoaded]);

  // Hàm cập nhật kích thước container
  const updateContainerSize = () => {
    if (containerRef.current && imgRef.current) {
      console.log("update container");
      const container = containerRef.current;
      setContainerSize({
        width: container.offsetWidth,
        height: container.offsetHeight
      });
    }
  };

  // Tính toán vị trí và kích thước của bounding box
  const calculateBoundingBoxStyle = (box: BoundingBox): React.CSSProperties => {
    if (!imgRef.current || !containerRef.current) return {};
    
    const img = imgRef.current;
    const imgWidth = img.clientWidth;
    const imgHeight = img.clientHeight;
    
    // Tính toán tỷ lệ co/giãn của ảnh
    // const scaleX = imgWidth / img.naturalWidth;
    // const scaleY = imgHeight / img.naturalHeight;
    
    // Tính toán vị trí và kích thước của box sau khi scale
    const left = box.x * imgWidth;
    const top = box.y * imgHeight;
    const width = box.width * imgWidth;
    const height = box.height * imgHeight;
    
    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    };
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-lg overflow-hidden shadow-lg" ref={containerRef}>
        {/* Container cho ảnh và bounding boxes */}
        <div className="relative w-full">
          {/* Ảnh */}
          <img 
            ref={imgRef}
            src={imageUrl} 
            alt="Uploaded preview" 
            className="w-full h-auto object-contain"
            style={{ display: 'block' }}
          />
          
          {/* Bounding boxes as absolutely positioned divs */}
          {imageLoaded && detections && detections.map((detection, index) => {
            const boxStyle = calculateBoundingBoxStyle(detection.bounding_box);
            console.log("có bounding box", detection.bounding_box);
            const confidence = Math.round(detection.confidence * 100);
            
            return (
              <div 
                key={index}
                className="absolute pointer-events-none"
                style={{
                  ...boxStyle,
                  border: '4px solid rgba(255, 65, 108, 0.8)', 
                  zIndex: 100,
                  borderImage: 'linear-gradient(to bottom, #FF416C, #FF4B2B) 1',
                  boxSizing: 'border-box'
                }}
              >
                {/* Label với độ tin cậy */}
                <div 
                  className="absolute top-0 left-0 transform -translate-y-full"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '4px 8px',
                    borderRadius: '4px 4px 0 0',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {`${confidence}% tin cậy`}
                </div>

                <div 
                  className="absolute bottom-0 right-0"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '2px 6px',
                    borderRadius: '4px 0 0 0',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {`#${index + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thông báo khi không tìm thấy khuôn mặt */}
      {isSuccess && detections && detections.length === 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Không tìm thấy khuôn mặt
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Không có khuôn mặt ca sĩ nào được phát hiện trong ảnh. Vui lòng thử tải lên một ảnh khác.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị thông tin khi có khuôn mặt */}
      {isSuccess && detections && detections.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Đã tìm thấy {detections.length} khuôn mặt
          </h2>
          
          <div className="space-y-8">
            {detections.map((detection, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      {detection.artist?.name || 'Không có thông tin'}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                      #{index + 1} • {Math.round(detection.confidence * 100)}% tin cậy
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row p-4">
                  <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                    {detection.artist && detection.artist.image ? (
                      <img 
                        src={detection.artist.image} 
                        alt={detection.artist.name || "Artist image"}
                        className="w-40 h-40 object-cover rounded-full border-4 border-indigo-100 shadow"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-2/3 md:pl-6">
                    <div className="space-y-4 text-gray-700">
                      {detection.artist?.birth_date && (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Ngày sinh:</span> 
                          <span className="ml-2">{detection.artist.birth_date}</span>
                        </div>
                      )}
                      
                      {detection.artist?.bio && (
                        <div>
                          <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <h4 className="font-medium">Tiểu sử</h4>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{detection.artist.bio}</p>
                        </div>
                      )}
                      
                      {detection.singer && detection.singer.songs && (
                        <div>
                          <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            <h4 className="font-medium">Các bài hát nổi bật</h4>
                          </div>
                          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                            {extractListItems(detection.singer.songs).map((song, idx) => (
                              <li key={idx}>{song}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {detection.singer && detection.singer.awards && (
                        <div>
                          <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <h4 className="font-medium">Giải thưởng</h4>
                          </div>
                          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                            {extractListItems(detection.singer.awards).map((award, idx) => (
                              <li key={idx}>{stripHtml(award)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {detection.artist?.genres && detection.artist.genres.length > 0 && (
                        <div>
                          <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <h4 className="font-medium">Thể loại</h4>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {detection.artist.genres.map((genre, idx) => (
                              <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Function to decode HTML entities and remove HTML tags
const stripHtml = (html: string | undefined): string => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

// Function to extract first few items from HTML list
const extractListItems = (items: any[] | string | undefined, maxItems = 5): string[] => {
  if (!items) return [];
  
  if (typeof items === 'string' && items.includes('<li>')) {
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    
    return matches
      .slice(0, maxItems)
      .map(item => item.replace(/<\/?[^>]+(>|$)/g, "").trim());
  }
  
  if (Array.isArray(items)) {
    return items.slice(0, maxItems).map(item => {
      if (typeof item === 'string') return item;
      return item.name || item.title || JSON.stringify(item);
    });
  }
  
  return [];
};

export default ResultDisplay;