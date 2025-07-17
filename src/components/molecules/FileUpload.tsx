import React from 'react';
import { Upload, X, File } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface FileUploadProps {
  onFilesSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSizeBytes?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  files?: File[];
}

export const FileUpload = React.memo<FileUploadProps>(
  ({
    onFilesSelect,
    onFileRemove,
    acceptedTypes = ['*'],
    maxFiles = 5,
    maxSizeBytes = 10 * 1024 * 1024, // 10MB
    multiple = true,
    disabled = false,
    className = '',
    files = [],
  }) => {
    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file: File): string | null => {
      if (maxSizeBytes && file.size > maxSizeBytes) {
        return `Arquivo muito grande. Máximo: ${formatFileSize(maxSizeBytes)}`;
      }

      if (acceptedTypes.length > 0 && !acceptedTypes.includes('*')) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const mimeType = file.type;

        const isValidType = acceptedTypes.some(
          (type) =>
            type === mimeType ||
            type === fileExtension ||
            (type.endsWith('/*') && mimeType.startsWith(type.slice(0, -1)))
        );

        if (!isValidType) {
          return `Tipo de arquivo não aceito. Aceitos: ${acceptedTypes.join(', ')}`;
        }
      }

      return null;
    };

    const handleFiles = (newFiles: File[]) => {
      if (disabled) return;

      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of newFiles) {
        if (files.length + validFiles.length >= maxFiles) {
          errors.push(`Máximo de ${maxFiles} arquivos permitido`);
          break;
        }

        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        onFilesSelect?.(validFiles);
      }

      if (errors.length > 0) {
        // Em uma implementação real, você mostraria esses erros via toast/notification
        console.warn('Erros de upload:', errors);
      }
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const selectedFiles = Array.from(e.target.files || []);
      handleFiles(selectedFiles);

      // Reset input value
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    const openFileDialog = () => {
      if (!disabled && inputRef.current) {
        inputRef.current.click();
      }
    };

    return (
      <div className={className}>
        {/* Upload Area */}
        <div
          className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-neutral-300 hover:border-neutral-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
          <p className="text-sm text-neutral-600 mb-1">
            Arraste arquivos aqui ou clique para selecionar
          </p>
          <p className="text-xs text-neutral-500">
            {acceptedTypes.includes('*')
              ? 'Qualquer tipo de arquivo'
              : `Aceitos: ${acceptedTypes.join(', ')}`}
          </p>
          <p className="text-xs text-neutral-500">
            Máximo: {maxFiles} arquivo{maxFiles > 1 ? 's' : ''},{' '}
            {formatFileSize(maxSizeBytes)} cada
          </p>
        </div>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={
            acceptedTypes.includes('*') ? undefined : acceptedTypes.join(',')
          }
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-3 bg-neutral-50 rounded-md"
              >
                <File className="w-4 h-4 text-neutral-400 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFileRemove?.(index)}
                  className="p-1 h-auto min-h-0 flex-shrink-0"
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

export default FileUpload;
