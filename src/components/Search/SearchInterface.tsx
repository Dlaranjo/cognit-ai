import React, { useState } from 'react';
import { Search, Filter, FileText, Calendar, User, Database } from 'lucide-react';
import { WorkspaceFilter } from './WorkspaceFilter';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useAuth } from '../../hooks/useAuth';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  projectName: string;
  workspaceName: string;
  workspaceId: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  relevanceScore: number;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Neural Networks Overview.pdf',
    content: 'This document covers the fundamentals of neural networks, including backpropagation, activation functions, and training methodologies. It provides detailed explanations of how neural networks learn from data...',
    projectName: 'Machine Learning Models',
    workspaceName: 'AI Research Hub',
    workspaceId: '1',
    type: 'PDF',
    uploadedAt: '2024-01-17',
    uploadedBy: 'Ricardo Almeida',
    relevanceScore: 0.95
  },
  {
    id: '2',
    title: 'API Documentation - Authentication',
    content: 'Complete guide to authentication endpoints including JWT token generation, refresh tokens, and security best practices for API access control...',
    projectName: 'API Documentation',
    workspaceName: 'Product Documentation',
    workspaceId: '2',
    type: 'Markdown',
    uploadedAt: '2024-01-20',
    uploadedBy: 'Ana Silva',
    relevanceScore: 0.87
  },
  {
    id: '3',
    title: 'Training Dataset Analysis.xlsx',
    content: 'Statistical analysis of the training dataset including data distribution, feature correlation, and preprocessing steps applied to ensure model accuracy...',
    projectName: 'Machine Learning Models',
    workspaceName: 'AI Research Hub',
    workspaceId: '1',
    type: 'Excel',
    uploadedAt: '2024-01-18',
    uploadedBy: 'Carlos Santos',
    relevanceScore: 0.82
  },
  {
    id: '4',
    title: 'Brand Guidelines 2024.pdf',
    content: 'Comprehensive brand guidelines including logo usage, color palette, typography, and visual identity standards for all marketing materials...',
    projectName: 'Brand Assets',
    workspaceName: 'Marketing Resources',
    workspaceId: '3',
    type: 'PDF',
    uploadedAt: '2024-02-01',
    uploadedBy: 'Maria Costa',
    relevanceScore: 0.78
  }
];

export const SearchInterface: React.FC = () => {
  const { user } = useAuth();
  const { workspaces, getUserPermission } = useWorkspaces(user.id);
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>(
    workspaces.map(w => w.id)
  );

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call with workspace filtering
    setTimeout(() => {
      const filteredResults = mockSearchResults.filter(result =>
        (result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         result.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedWorkspaces.length === 0 || selectedWorkspaces.includes(result.workspaceId))
      );
      
      setResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  const getSelectedWorkspaceNames = () => {
    if (selectedWorkspaces.length === 0 || selectedWorkspaces.length === workspaces.length) {
      return 'all portfolios';
    }
    
    const names = workspaces
      .filter(w => selectedWorkspaces.includes(w.id))
      .map(w => w.name);
    
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names[0]} and ${names.length - 1} others`;
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Knowledge Base</h2>
        <p className="text-gray-600">
          Search across documents in {getSelectedWorkspaceNames()}
        </p>
      </div>

      {/* Search Input with Context Filter */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Context Filter */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Search Context</span>
              <WorkspaceFilter
                workspaces={workspaces}
                selectedWorkspaces={selectedWorkspaces}
                onSelectionChange={setSelectedWorkspaces}
                getUserPermission={getUserPermission}
              />
            </div>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for documents, content, or topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
              className="w-full pl-12 pr-20 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset rounded-b-xl"
            />
            <button
              onClick={() => handleSearch(query)}
              disabled={!query.trim() || selectedWorkspaces.length === 0}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Context Summary */}
        {selectedWorkspaces.length > 0 && (
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-500">
              Searching in {selectedWorkspaces.length} of {workspaces.length} portfolio{workspaces.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* No Workspaces Selected Warning */}
      {selectedWorkspaces.length === 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-amber-600" />
              <p className="text-amber-800 font-medium">No portfolios selected</p>
            </div>
            <p className="text-amber-700 text-sm mt-1">
              Please select at least one portfolio to search in.
            </p>
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearching ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching knowledge base...</p>
        </div>
      ) : hasSearched ? (
        <div className="max-w-4xl mx-auto">
          {results.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                  {selectedWorkspaces.length < workspaces.length && (
                    <span> in {getSelectedWorkspaceNames()}</span>
                  )}
                </p>
              </div>
              
              <div className="space-y-4">
                {results.map(result => (
                  <div key={result.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-orange-600 hover:text-orange-800 cursor-pointer mb-1">
                          {highlightText(result.title, query)}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{result.type}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Database className="w-3 h-3" />
                            <span>{result.workspaceName}</span>
                          </span>
                          <span>{result.projectName}</span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(result.uploadedAt).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{result.uploadedBy}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round(result.relevanceScore * 100)}% match
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">
                      {highlightText(result.content, query)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">
                Try different keywords, check your spelling, or adjust your portfolio selection
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
          <p className="text-gray-500">Enter keywords to search across your selected portfolios</p>
        </div>
      )}
    </div>
  );
};