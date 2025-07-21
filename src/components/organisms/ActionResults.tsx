import React from 'react';
import {
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  BarChart3,
  Presentation,
} from 'lucide-react';

interface ActionResult {
  id: string;
  type: 'file' | 'analysis' | 'summary';
  title: string;
  description: string;
  downloadUrl?: string;
  previewUrl?: string;
  status: 'completed' | 'processing' | 'failed';
}

interface ActionResultsProps {
  actions: ActionResult[];
}

export const ActionResults: React.FC<ActionResultsProps> = ({ actions }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'analysis':
        return <BarChart3 className="w-5 h-5 text-green-500" />;
      case 'summary':
        return <Presentation className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'processing':
        return 'border-yellow-200 bg-yellow-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <div
          key={action.id}
          className={`border-2 rounded-xl p-4 transition-all ${getStatusColor(action.status)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">{getTypeIcon(action.type)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-gray-900 truncate">
                  {action.title}
                </h4>
                {getStatusIcon(action.status)}
              </div>

              <p className="text-sm text-gray-600 mb-3">{action.description}</p>

              {/* Action Buttons */}
              {action.status === 'completed' && (
                <div className="flex items-center space-x-2">
                  {action.downloadUrl && (
                    <button className="inline-flex items-center space-x-1 px-3 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  )}
                  {action.previewUrl && (
                    <button className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
              )}

              {action.status === 'processing' && (
                <div className="flex items-center space-x-2 text-sm text-yellow-700">
                  <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              )}

              {action.status === 'failed' && (
                <div className="flex items-center space-x-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span>Failed to process. Please try again.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
