import React, { useState } from 'react';
import { Plus, ArrowLeft, FolderOpen, FileText, Calendar } from 'lucide-react';
import { Workspace, Project } from '../../types';
import { CreateProjectModal } from './CreateProjectModal';

interface ProjectListProps {
  workspace: Workspace;
  projects: Project[];
  canCreateProject: boolean;
  onBack: () => void;
  onProjectSelect: (project: Project) => void;
  onCreateProject: (
    workspaceId: string,
    name: string,
    description?: string
  ) => Promise<Project>;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  workspace,
  projects,
  canCreateProject,
  onBack,
  onProjectSelect,
  onCreateProject,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

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
            <h2 className="text-xl font-semibold text-gray-900">
              {workspace.name}
            </h2>
            <p className="text-gray-600">Projects</p>
          </div>
        </div>

        {canCreateProject && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group hover:border-orange-300"
              onClick={() => onProjectSelect(project)}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <FileText className="w-3 h-3" />
                    <span>{project.documentsCount} documents</span>
                  </div>
                </div>
              </div>

              {project.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500">
            {canCreateProject
              ? 'Create your first project to organize your documents'
              : 'No projects available in this workspace'}
          </p>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          workspaceName={workspace.name}
          onClose={() => setShowCreateModal(false)}
          onCreate={async (name, description) => {
            await onCreateProject(workspace.id, name, description);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};
