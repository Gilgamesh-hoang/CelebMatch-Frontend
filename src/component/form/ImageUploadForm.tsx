// import { ChangeEvent, useRef, DragEvent } from 'react';

// interface ImageUploadFormProps {
//   onFileSelect: (file: File) => void;
//   selectedFile: File | null; 
// }
// const ImageUploadForm = ({ onFileSelect, selectedFile } : ImageUploadFormProps) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = (e : ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       onFileSelect(e.target.files[0]);
//     }
//   };

//   const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       onFileSelect(e.dataTransfer.files[0]);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="flex justify-center items-center">
//       <div
//         className="w-[320px] h-[320px] border-2 border-dashed border-gray-300 rounded-xl bg-white p-4 text-center cursor-pointer hover:border-indigo-500 transition-colors shadow-sm"
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         onClick={triggerFileInput}
//       >
//         <input
//           type="file"
//           className="hidden"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           accept="image/*"
//         />

//         <div className="flex flex-col justify-center items-center h-full space-y-3">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-10 w-10 text-indigo-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//             />
//           </svg>

//           <div className="text-gray-600 text-sm text-ellipsis overflow-hidden w-full px-2 whitespace-nowrap">
//             {selectedFile ? (
//               <p className="text-indigo-600 font-medium">{selectedFile.name}</p>
//             ) : (
//               <>
//                 <p className="font-semibold">Kéo & thả ảnh vào đây</p>
//                 <p className="text-xs text-gray-500">hoặc nhấn để chọn</p>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageUploadForm;
import { Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';

interface ImageUploadFormProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

const { Dragger } = Upload;

const ImageUploadForm = ({ onFileSelect }: ImageUploadFormProps) => {
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    accept: 'image/*',
    beforeUpload(file: RcFile) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được chọn file ảnh!');
        return Upload.LIST_IGNORE;
      }
      onFileSelect(file);
      return false;
    },
  };

  return (
    <Dragger {...props} style={{ borderRadius: 12, padding: 20 }}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined style={{ color: '#1677ff' }} />
      </p>
      <p className="ant-upload-text font-semibold text-gray-700">
        Kéo & thả ảnh vào đây hoặc nhấn để chọn
      </p>
      <p className="ant-upload-hint text-xs text-gray-500">
        Hỗ trợ định dạng .jpg, .png, .jpeg
      </p>
    </Dragger>
  );
};

export default ImageUploadForm;
