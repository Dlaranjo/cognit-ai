import React from 'react';
import { Paperclip } from 'lucide-react';

/**
 * Formata o tamanho do arquivo em uma string legível
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Retorna o componente de ícone de clipe branco para uso nos inputs (antes do envio)
 */
export const getFileIcon = (): React.ReactElement => {
  return React.createElement(Paperclip, { className: "w-4 h-4 text-white" });
};

/**
 * Retorna o label legível para o tipo de arquivo
 */
export const getFileTypeLabel = (type: string): string => {
  if (type.startsWith('image/')) {
    return 'Imagem';
  } else if (type.includes('pdf')) {
    return 'PDF';
  } else if (type.includes('text/')) {
    return 'Texto';
  } else if (type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    return 'Word';
  } else if (type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return 'Excel';
  } else if (type.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
    return 'PowerPoint';
  } else if (type.includes('application/zip') || type.includes('application/x-rar')) {
    return 'Arquivo';
  } else {
    return 'Arquivo';
  }
};
