import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles } from 'lucide-react';

interface StreamingMessageProps {
  content: string;
  modelName: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({ 
  content, 
  modelName 
}) => {
  return (
    <div className="flex items-start space-x-4 animate-fade-in">
      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="mb-2">
          <span className="text-sm font-semibold text-gray-700">{modelName}</span>
        </div>
        {/* Streaming Message - No Bubble, Direct Text */}
        <div className="mr-8 text-base leading-relaxed text-gray-800">
          <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800 prose-ol:list-decimal prose-ul:list-disc prose-li:list-item">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: (props) => {
                  const { children, ...rest } = props;
                  const isInline = !String(children).includes('\n');
                  return isInline ? (
                    <code className="bg-orange-50 text-orange-600 px-1 py-0.5 rounded text-sm" {...rest}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-gray-50 border rounded p-3 overflow-x-auto">
                      <code className="text-sm" {...rest}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                h1: ({ children }) => <h1 className="text-xl font-bold text-gray-800 mb-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold text-gray-800 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold text-gray-800 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-gray-800 mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-4 text-gray-800 mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 text-gray-800 mb-3 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-gray-800 ml-2">{children}</li>,
                strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
              }}
            >
              {content}
            </ReactMarkdown>
            <span className="inline-flex items-center ml-1">
              <span className="w-0.5 h-4 bg-orange-500 animate-pulse"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};