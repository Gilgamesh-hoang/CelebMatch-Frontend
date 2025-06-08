// const LoadingOverlay = () => {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
//           <p className="text-gray-700">Đang phân tích ảnh...</p>
//         </div>
//       </div>
//     );
//   };
  
//   export default LoadingOverlay;
import React from 'react';
import { Spin, Typography } from 'antd';

const { Text } = Typography;

const LoadingOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          padding: 24,
          backgroundColor: '#fff',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Spin size="large" />
        <Text type="secondary">Đang phân tích ảnh...</Text>
      </div>
    </div>
  );
};

export default LoadingOverlay;
