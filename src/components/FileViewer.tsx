import React, { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  mimeType: string;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  mimeType
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const renderFileContent = () => {
    // PDF files - use iframe with Google Docs viewer for better compatibility
    if (mimeType === 'application/pdf') {
      return (
        <div className="w-full h-full flex flex-col">
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            className="w-full flex-1 border-0"
            style={{ minHeight: '80vh' }}
            title={fileName}
          />
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Having trouble viewing? 
            </p>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              Open PDF in new tab
            </a>
          </div>
        </div>
      );
    }

    // Image files
    if (mimeType.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center h-full overflow-auto">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
          />
        </div>
      );
    }

    // Text files
    if (mimeType.startsWith('text/') || mimeType === 'application/json') {
      return (
        <div className="h-full overflow-auto p-4">
          <iframe
            src={fileUrl}
            className="w-full h-full border-0 bg-white"
            style={{ minHeight: '600px' }}
          />
        </div>
      );
    }

    // Word documents (modern browsers support viewing)
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return (
        <div className="h-full overflow-auto">
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            className="w-full h-full border-0"
            style={{ minHeight: '600px' }}
          />
        </div>
      );
    }

    // Excel files
    if (mimeType.includes('sheet') || mimeType.includes('excel')) {
      return (
        <div className="h-full overflow-auto">
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            className="w-full h-full border-0"
            style={{ minHeight: '600px' }}
          />
        </div>
      );
    }

    // PowerPoint files
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
      return (
        <div className="h-full overflow-auto">
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            className="w-full h-full border-0"
            style={{ minHeight: '600px' }}
          />
        </div>
      );
    }

    // Video files
    if (mimeType.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center h-full">
          <video
            src={fileUrl}
            controls
            className="max-w-full max-h-full"
            style={{ maxHeight: '80vh' }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Audio files
    if (mimeType.startsWith('audio/')) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🎵</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {fileName}
            </h3>
            <audio src={fileUrl} controls className="w-full max-w-md">
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      );
    }

    // Fallback for unsupported file types
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📄</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {fileName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This file type cannot be previewed in the browser.
          </p>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Download File
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {fileName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {mimeType}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {/* Zoom controls for images */}
              {mimeType.startsWith('image/') && (
                <>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={handleRotate}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Rotate"
                  >
                    <RotateCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </>
              )}
              
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* File Content */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden">
          {renderFileContent()}
        </div>
      </div>
    </div>
  );
};