import React, { useState } from 'react';
import { Database, X, Search, FileText, Calendar, User, ArrowLeft, FolderOpen } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { Input } from '../atoms/Input';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useAuth } from '../../hooks/useAuth';
import type { Workspace, Project } from '../../types';

interface StudioKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'search' | 'browse';
type BrowseLevel = 'workspaces' | 'projects' | 'documents';

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

// Mock data - será substituído pela API real
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Neural Networks Overview.pdf',
    content: 'This document covers the fundamentals of neural networks, including backpropagation, activation functions, and training methodologies...',
    projectName: 'Machine Learning Models',
    workspaceName: 'AI Research Hub',
    workspaceId: '1',
    type: 'PDF',
    uploadedAt: '2024-01-17',
    uploadedBy: 'Ricardo Almeida',
    relevanceScore: 0.95,
  },
  {
    id: '2',
    title: 'Data Processing Pipeline.docx',
    content: 'Comprehensive guide for setting up automated data processing pipelines using Python and Apache Airflow...',
    projectName: 'Data Engineering',
    workspaceName: 'Tech Solutions',
    workspaceId: '2',
    type: 'DOCX',
    uploadedAt: '2024-01-16',
    uploadedBy: 'Ana Silva',
    relevanceScore: 0.87,
  },
];

export const StudioKnowledgeModal: React.FC<StudioKnowledgeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { workspaces, getProjectsByWorkspace, getDocumentsByProject } = useWorkspaces(user?.id);

  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [browseLevel, setBrowseLevel] = useState<BrowseLevel>('workspaces');
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedWorkspaces] = useState<string[]>(
    workspaces.map((w) => w.id)
  );

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate API call
    setTimeout(() => {
      const filteredResults = mockSearchResults.filter(
        (result) =>
          (result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.content.toLowerCase().includes(query.toLowerCase())) &&
          (selectedWorkspaces.length === 0 ||
            selectedWorkspaces.includes(result.workspaceId))
      );

      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  // Navigation handlers
  const handleWorkspaceSelect = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setBrowseLevel('projects');
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setBrowseLevel('documents');
  };

  const handleBackNavigation = () => {
    if (browseLevel === 'documents') {
      setBrowseLevel('projects');
      setSelectedProject(null);
    } else if (browseLevel === 'projects') {
      setBrowseLevel('workspaces');
      setSelectedWorkspace(null);
    }
  };

  // Get current data based on browse level
  const currentProjects = selectedWorkspace ? getProjectsByWorkspace(selectedWorkspace.id) : [];
  const currentDocuments = selectedProject ? getDocumentsByProject(selectedProject.id) : [];

  // Highlight search text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Knowledge Base</h2>
              <p className="text-sm text-gray-600">
                {viewMode === 'search'
                  ? `Pesquisar em ${workspaces.length} portfolios`
                  : browseLevel === 'workspaces'
                    ? `${workspaces.length} portfolios disponíveis`
                    : browseLevel === 'projects'
                      ? `${currentProjects.length} projetos em ${selectedWorkspace?.name}`
                      : `${currentDocuments.length} documentos em ${selectedProject?.name}`
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-100 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('search')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                viewMode === 'search'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Pesquisar</span>
            </button>
            <button
              onClick={() => setViewMode('browse')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                viewMode === 'browse'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Navegar</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'search' ? (
            <div className="h-full flex flex-col">
              {/* Search Interface */}
              <div className="p-6 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar documentos, conteúdo ou tópicos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    className="pl-10 pr-20 py-4 text-lg bg-white border-gray-200 focus:border-orange-400 focus:ring-orange-200"
                  />
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    disabled={!searchQuery.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto">
                {isSearching ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Pesquisando na base de conhecimento...</p>
                  </div>
                ) : hasSearched ? (
                  <div className="p-6">
                    {searchResults.length > 0 ? (
                      <>
                        <div className="mb-6">
                          <p className="text-sm text-gray-600">
                            Encontrados {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{searchQuery}"
                          </p>
                        </div>
                        <div className="space-y-4">
                          {searchResults.map((result) => (
                            <div
                              key={result.id}
                              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-orange-600 hover:text-orange-800 mb-1">
                                    {highlightText(result.title, searchQuery)}
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
                                      <span>{new Date(result.uploadedAt).toLocaleDateString('pt-BR')}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <User className="w-3 h-3" />
                                      <span>{result.uploadedBy}</span>
                                    </span>
                                  </div>
                                </div>
                                <Badge variant="secondary" className="ml-4">
                                  {Math.round(result.relevanceScore * 100)}% relevante
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {highlightText(result.content, searchQuery)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                        <p className="text-gray-600">
                          Tente usar termos diferentes ou verifique se há documentos nos portfolios selecionados.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Pesquisar Knowledge Base</h3>
                    <p className="text-gray-600">
                      Digite sua consulta acima para encontrar documentos relevantes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Browse Mode
            <div className="h-full flex flex-col">
              {/* Navigation Header */}
              {browseLevel !== 'workspaces' && (
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <button
                    onClick={handleBackNavigation}
                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                </div>
              )}

              {/* Browse Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {browseLevel === 'workspaces' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workspaces.map((workspace) => (
                      <div
                        key={workspace.id}
                        onClick={() => handleWorkspaceSelect(workspace)}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{workspace.name}</h3>
                            <p className="text-sm text-gray-500">{workspace.projectCount} projetos</p>
                          </div>
                        </div>
                        {workspace.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{workspace.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {browseLevel === 'projects' && selectedWorkspace && (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedWorkspace.name}</h3>
                      <p className="text-gray-600">{currentProjects.length} projetos disponíveis</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentProjects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => handleProjectSelect(project)}
                          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <FolderOpen className="w-8 h-8 text-orange-500" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{project.name}</h4>
                              <p className="text-sm text-gray-500">{project.documentCount || 0} documentos</p>
                            </div>
                          </div>
                          {project.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {browseLevel === 'documents' && selectedProject && (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedProject.name}</h3>
                      <p className="text-gray-600">{currentDocuments.length} documentos disponíveis</p>
                    </div>
                    <div className="space-y-3">
                      {currentDocuments.map((document) => (
                        <div
                          key={document.id}
                          className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-orange-500" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{document.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span>{document.type}</span>
                                <span>{document.size ? `${Math.round(document.size / 1024)} KB` : 'N/A'}</span>
                                <span>{new Date(document.createdAt).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>💡 Dica: Use Ctrl+K para abrir a Knowledge Base rapidamente</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Total: {workspaces.reduce((acc, w) => acc + (w.documentCount || 0), 0)} documentos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
