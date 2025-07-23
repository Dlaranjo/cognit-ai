import React, { useState } from 'react';
import { Database, X, Search, FileText, ArrowLeft, FolderOpen } from 'lucide-react';
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

// Dados de exemplo - será substituído pela API real
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Visão Geral de Redes Neurais.pdf',
    content: 'Este documento aborda os fundamentos das redes neurais, incluindo backpropagation, funções de ativação e metodologias de treinamento...',
    projectName: 'Modelos de Machine Learning',
    workspaceName: 'Hub de Pesquisa IA',
    workspaceId: '1',
    type: 'PDF',
    uploadedAt: '2024-01-17',
    uploadedBy: 'Ricardo Almeida',
    relevanceScore: 0.95,
  },
  {
    id: '2',
    title: 'Pipeline de Processamento de Dados.docx',
    content: 'Guia abrangente para configurar pipelines automatizados de processamento de dados usando Python e Apache Airflow...',
    projectName: 'Engenharia de Dados',
    workspaceName: 'Soluções Tech',
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
              <h2 className="text-xl font-bold text-gray-900">Base de Conhecimento</h2>
              <p className="text-sm text-gray-600">
                {viewMode === 'search'
                  ? `${workspaces.length} portfólios disponíveis`
                  : browseLevel === 'workspaces'
                    ? `${workspaces.length} portfólios`
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
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('search')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'search'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              Pesquisar
            </button>
            <button
              onClick={() => setViewMode('browse')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'browse'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              Navegar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'search' ? (
            <div className="h-full flex flex-col">
              {/* Search Interface */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar documentos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    className="pl-10 pr-16 bg-white border-gray-200 focus:border-orange-400 focus:ring-orange-200"
                  />
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    disabled={!searchQuery.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto">
                {isSearching ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm">Pesquisando...</p>
                  </div>
                ) : hasSearched ? (
                  <div className="p-3">
                    {searchResults.length > 0 ? (
                      <>
                        <div className="mb-4">
                          <p className="text-xs text-gray-600">
                            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{searchQuery}"
                          </p>
                        </div>
                        <div className="space-y-2">
                          {searchResults.map((result) => (
                            <div
                              key={result.id}
                              className="rounded-lg border border-gray-200 p-3 hover:shadow-sm hover:border-orange-200 transition-all duration-200 cursor-pointer"
                            >
                              <div className="mb-2">
                                <h3 className="font-medium text-orange-600 hover:text-orange-800 text-sm mb-1">
                                  {highlightText(result.title, searchQuery)}
                                </h3>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <span>{result.type}</span>
                                  <span>•</span>
                                  <span>{result.workspaceName}</span>
                                  <span>•</span>
                                  <span>{new Date(result.uploadedAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                {highlightText(result.content, searchQuery)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-medium text-gray-900 mb-1">Nenhum resultado</h3>
                        <p className="text-gray-600 text-sm">
                          Tente usar termos diferentes
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-1">Pesquisar Base de Conhecimento</h3>
                    <p className="text-gray-600 text-sm">
                      Digite sua consulta acima
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
                <div className="p-3 border-b border-gray-100">
                  <button
                    onClick={handleBackNavigation}
                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-800 transition-colors text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                </div>
              )}

              {/* Browse Content */}
              <div className="flex-1 overflow-y-auto p-3">
                {browseLevel === 'workspaces' && (
                  <div className="space-y-2">
                    {workspaces.map((workspace) => (
                      <div
                        key={workspace.id}
                        onClick={() => handleWorkspaceSelect(workspace)}
                        className="rounded-lg border border-gray-200 p-3 hover:shadow-sm hover:border-orange-200 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <Database className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm">{workspace.name}</h3>
                            <p className="text-xs text-gray-500">{workspace.projectCount} projetos</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {browseLevel === 'projects' && selectedWorkspace && (
                  <div className="space-y-2">
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{selectedWorkspace.name}</h3>
                      <p className="text-gray-600 text-xs">{currentProjects.length} projetos</p>
                    </div>
                    <div className="space-y-2">
                      {currentProjects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => handleProjectSelect(project)}
                          className="rounded-lg border border-gray-200 p-3 hover:shadow-sm hover:border-orange-200 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <FolderOpen className="w-6 h-6 text-orange-500" />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{project.name}</h4>
                              <p className="text-xs text-gray-500">{project.documentCount || 0} documentos</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {browseLevel === 'documents' && selectedProject && (
                  <div className="space-y-2">
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{selectedProject.name}</h3>
                      <p className="text-gray-600 text-xs">{currentDocuments.length} documentos</p>
                    </div>
                    <div className="space-y-2">
                      {currentDocuments.map((document) => (
                        <div
                          key={document.id}
                          className="rounded-lg border border-gray-200 p-3 hover:shadow-sm hover:border-orange-200 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-6 h-6 text-orange-500" />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{document.name}</h4>
                              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                <span>{document.type}</span>
                                <span>•</span>
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
        {workspaces.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
            <div className="text-center text-xs text-gray-500">
              {workspaces.reduce((acc, w) => acc + (w.documentCount || 0), 0)} documentos em {workspaces.length} portfólios
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
