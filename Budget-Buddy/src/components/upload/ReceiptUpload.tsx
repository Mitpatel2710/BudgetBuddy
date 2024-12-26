import React, { useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

interface ReceiptUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function ReceiptUpload({ onFileSelect, selectedFile }: ReceiptUploadProps) {
  const [error, setError] = useState<string>('');

  // ... rest of the component code remains the same ...

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Receipt Upload (Optional)
      </label>
      
      {selectedFile ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span className="text-sm text-blue-700 dark:text-blue-300 truncate">
              {selectedFile.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </button>
        </motion.div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {isDragActive ? (
                <p>Drop the receipt here</p>
              ) : (
                <p>Drag & drop a receipt or click to select</p>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supports: JPG, PNG, PDF (max 5MB)
            </p>
          </div>
        </div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </motion.div>
      )}
    </div>
  );
}