import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                {isDragActive ? (
                  <p>Drop the file here</p>
                ) : (
                  <p>Drag & drop a receipt or click to select</p>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Supports: JPG, PNG, PDF (max 5MB)
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}