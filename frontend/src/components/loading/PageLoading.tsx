import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PageLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Loading...', 
  fullScreen = true 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${
      fullScreen ? 'min-h-screen' : 'min-h-[200px]'
    }`}>
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default PageLoading;