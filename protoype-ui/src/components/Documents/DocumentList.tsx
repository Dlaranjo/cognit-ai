import React, { useState } from 'react';
import { ArrowLeft, Plus, Upload, FileText, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Project, Document } from '../../types';

interface DocumentListProps {
  project: Project;
  documents: Document[];
  canAddDocuments: boolean;
  onBack: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  project,
  documents,
  canAddDocuments,
  onBack
}) => {
  const [dragOver, setDragOver] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'word': return '📝';
      default: return '📄';
    }
  };

  const getStatusIcon = (processed: boolean) => {
    return processed ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canAddDocuments) setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file upload logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
            <p className="text-gray-600">Documents</p>
          </div>
        </div>
        
        {canAddDocuments && (
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Documents</span>
          </button>
        )}
      </div>

      {/* Upload Area */}
      {canAddDocuments && (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver 
              ? 'border-orange-400 bg-orange-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop files here, or{' '}
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              browse files
            </button>
          </p>
          <p className="text-sm text-gray-400">
            Supports PDF, DOC, DOCX, TXT, and more
          </p>
        </div>
      )}

      {/* Documents List */}
      {documents.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-900">Documents ({documents.length})</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {documents.map(document => (
              <div key={document.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-2xl">{getFileIcon(document.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{document.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{document.type}</span>
                        <span>{formatFileSize(document.size)}</span>
                        <span>Uploaded {new Date(document.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(document.processed)}
                      <span className="text-sm text-gray-600">
                        {document.processed ? 'Processed' : 'Processing'}
                      </span>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-500">
            {canAddDocuments 
              ? 'Upload your first document to get started'
              : 'No documents available in this project'
            }
          </p>
        </div>
      )}
    </div>
  );
};