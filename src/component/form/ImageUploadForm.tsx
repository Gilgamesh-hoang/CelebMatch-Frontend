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
