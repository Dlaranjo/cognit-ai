import { useState, useCallback } from 'react';
import { config } from '../shared/config';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedFiles: File[];
}

interface UseFileUploadOptions {
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
  onUploadComplete?: (files: File[]) => void;
  onUploadError?: (error: string) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    maxFiles = 10,
    maxFileSize = config.MAX_FILE_SIZE,
    acceptedTypes = config.SUPPORTED_FILE_TYPES,
    onUploadComplete,
    onUploadError,
  } = options;

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedFiles: [],
  });

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File "${file.name}" is too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`;
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension && !acceptedTypes.includes(fileExtension)) {
      return `File type "${fileExtension}" is not supported. Accepted types: ${acceptedTypes.join(', ')}.`;
    }

    return null;
  }, [maxFileSize, acceptedTypes]);

  const validateFiles = useCallback((files: FileList | File[]): { validFiles: File[]; errors: string[] } => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check total number of files
    if (fileArray.length > maxFiles) {
      errors.push(`Too many files selected. Maximum is ${maxFiles} files.`);
      return { validFiles: [], errors };
    }

    // Validate each file
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    return { validFiles, errors };
  }, [maxFiles, validateFile]);

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const { validFiles, errors } = validateFiles(files);

    if (errors.length > 0) {
      const errorMessage = errors.join(' ');
      setUploadState(prev => ({ ...prev, error: errorMessage }));
      onUploadError?.(errorMessage);
      return;
    }

    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null,
    }));

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadState(prev => ({ ...prev, progress: i }));
      }

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        uploadedFiles: [...prev.uploadedFiles, ...validFiles],
      }));

      onUploadComplete?.(validFiles);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: errorMessage,
      }));
      onUploadError?.(errorMessage);
    }
  }, [validateFiles, onUploadComplete, onUploadError]);

  const removeFile = useCallback((fileToRemove: File) => {
    setUploadState(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(file => file !== fileToRemove),
    }));
  }, []);

  const clearFiles = useCallback(() => {
    setUploadState(prev => ({
      ...prev,
      uploadedFiles: [],
      error: null,
      progress: 0,
    }));
  }, []);

  const clearError = useCallback(() => {
    setUploadState(prev => ({ ...prev, error: null }));
  }, []);

  // Helper function to format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    // State
    ...uploadState,
    
    // Actions
    uploadFiles,
    removeFile,
    clearFiles,
    clearError,
    
    // Helpers
    validateFile,
    validateFiles,
    formatFileSize,
    
    // Config
    maxFiles,
    maxFileSize,
    acceptedTypes,
  };
};
