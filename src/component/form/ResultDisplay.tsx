import { useEffect, useRef, useState } from 'react';

const ResultDisplay = ({ imageUrl, detections, isSuccess }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [selectedFace, setSelectedFace] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.onload = () => {
        setImageLoaded(true);
      };
    }
  }, [imageUrl]);

  useEffect(() => {
    if (!canvasRef.current || !imgRef.current || !imageLoaded || !detections || detections.length === 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    // Set canvas dimensions to match the image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Draw bounding boxes
    detections.forEach((detection, index) => {
      const { bounding_box, confidence } = detection;
      const { x, y, width, height } = bounding_box;
      
      const boxX = x * img.width;
      const boxY = y * img.height;
      const boxWidth = width * img.width;
      const boxHeight = height * img.height;

      // Draw bounding box
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      // Draw label with confidence score
      ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
      ctx.fillRect(boxX, boxY - 25, 120, 25);
      
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText(`${Math.round(confidence * 100)}% tin cậy`, boxX + 5, boxY - 7);
    });
  }, [detections, imageLoaded]);

  const handleCanvasClick = (e) => {
    if (!detections || detections.length === 0 || !canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if click is inside any bounding box
    for (let i = 0; i < detections.length; i++) {
      const { bounding_box } = detections[i];
      const { x: boxX, y: boxY, width: boxWidth, height: boxHeight } = bounding_box;
      
      const scaledBoxX = boxX * imgRef.current.width;
      const scaledBoxY = boxY * imgRef.current.height;
      const scaledBoxWidth = boxWidth * imgRef.current.width;
      const scaledBoxHeight = boxHeight * imgRef.current.height;

      if (
        x >= scaledBoxX && 
        x <= scaledBoxX + scaledBoxWidth && 
        y >= scaledBoxY && 
        y <= scaledBoxY + scaledBoxHeight
      ) {
        setSelectedFace(detections[i]);
        return;
      }
    }

    // If click is outside any box, deselect
    setSelectedFace(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="border rounded overflow-auto shadow-sm bg-gray-100 p-2 relative">
          <img 
            ref={imgRef}
            src={imageUrl} 
            alt="Uploaded preview" 
            className="max-w-full h-auto mx-auto" 
            style={{ display: 'block' }}
          />
          <canvas 
            ref={canvasRef} 
            onClick={handleCanvasClick}
            className="absolute top-0 left-0 w-full h-full cursor-pointer"
            style={{ display: detections && detections.length > 0 ? 'block' : 'none' }}
          />
        </div>
      </div>

      {isSuccess && detections && detections.length === 0 && (
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
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

      {selectedFace && (
        <div className="bg-white border rounded-lg shadow-lg p-6 relative mt-6 animate-fadeIn">
          <button 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={() => setSelectedFace(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
              {selectedFace.artist && selectedFace.artist.image ? (
                <img 
                  src={selectedFace.artist.image} 
                  alt={selectedFace.artist.name}
                  className="w-40 h-40 object-cover rounded-full border-4 border-indigo-100 shadow"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="md:w-2/3 md:pl-6">
              <h3 className="text-xl font-bold mb-2">
                {selectedFace.artist ? selectedFace.artist.name : 'Không có thông tin'}
              </h3>
              
              <div className="mb-3">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {Math.round(selectedFace.confidence * 100)}% tin cậy
                </div>
              </div>
              
              {selectedFace.artist && (
                <div className="space-y-3 text-gray-700">
                  {selectedFace.artist.birth_date && (
                    <p className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Ngày sinh: {selectedFace.artist.birth_date}
                    </p>
                  )}
                  
                  {selectedFace.artist.bio && (
                    <div>
                      <h4 className="font-medium mb-1">Tiểu sử</h4>
                      <p className="text-sm">{selectedFace.artist.bio}</p>
                    </div>
                  )}
                  
                  {selectedFace.artist.genres && selectedFace.artist.genres.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-1">Thể loại</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedFace.artist.genres.map((genre, index) => (
                          <span key={index} className="px-2 py-1 rounded text-xs bg-gray-100">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isSuccess && detections && detections.length > 0 && !selectedFace && (
        <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-md">
          Đã tìm thấy {detections.length} khuôn mặt. Nhấp vào một khuôn mặt để xem thông tin chi tiết.
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;