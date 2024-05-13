// components/CustomAlert.tsx
import React from 'react';

interface CustomAlertProps {
  message: string;
  type: 'error' | 'success' | 'warning';  // Add more types as needed
  onClose?: () => void;  // Optional close handler
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type, onClose }) => {
  const backgroundColors = {
    error: 'bg-[#F87171] border-[#F87171]',
    success: 'bg-[#34D399] border-[#34D399]',
    warning: 'bg-warning border-warning',
  };

  return (
    <div className={`flex w-full border-l-6 ${backgroundColors[type]} bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9`}>
      <div className="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-opacity-30">
        {/* Icon can be dynamic based on type */}
      </div>
      <div className="w-full">
        <h5 className="mb-3 text-lg font-semibold">{message}</h5>
        {onClose && (
          <button onClick={onClose} className="text-sm text-red-500">Close</button>
        )}
      </div>
    </div>
  );
};

export default CustomAlert;
