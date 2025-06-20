type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
};
const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-gray-300 bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="mt-2 text-gray-600">{message}</p>
                <div className="mt-4 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
