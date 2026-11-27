import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  FilePlus,
  FolderPlus,
  Trash2,
  Minimize2,
} from 'lucide-react';
import type { FileNode } from '../../types/fileSystem';
import { getFileIcon } from '../../utils/fileIcons';

interface FileTreeProps {
  files: FileNode[];
  activeFileId: string | null;
  onSelectFile: (file: FileNode) => void;
  onCreateFile: (name: string, parentFolderId: string | null) => void;
  onCreateFolder: (name: string, parentFolderId: string | null) => void;
  onDeleteNode: (nodeId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onCollapseAll: () => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onDeleteNode,
  onToggleFolder,
  onCollapseAll,
}) => {
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
  const [creationParentId, setCreationParentId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const handleStartCreation = (type: 'file' | 'folder', parentId: string | null = null) => {
    setIsCreating(type);
    setCreationParentId(parentId);
    setNewItemName('');
  };

  const handleFinishCreation = () => {
    const trimmed = newItemName.trim();
    if (trimmed) {
      if (isCreating === 'file') {
        onCreateFile(trimmed, creationParentId);
      } else if (isCreating === 'folder') {
        onCreateFolder(trimmed, creationParentId);
      }
    }
    setIsCreating(null);
    setCreationParentId(null);
    setNewItemName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinishCreation();
    } else if (e.key === 'Escape') {
      setIsCreating(null);
      setCreationParentId(null);
      setNewItemName('');
    }
  };

  const renderTree = (nodes: FileNode[], depth = 0): React.ReactNode => {
    return nodes.map((node) => {
      const isFolder = node.type === 'folder';
      const isActive = node.id === activeFileId;

      return (
        <div key={node.id} className="tree-node-wrapper">
          <div
            className={`tree-node ${isActive ? 'active' : ''}`}
            style={{ paddingLeft: `${14 + depth * 16}px` }}
            onClick={() => {
              if (isFolder) {
                onToggleFolder(node.id);
              } else {
                onSelectFile(node);
              }
            }}
          >
            <span className="tree-arrow">
              {isFolder ? (
                node.isExpanded ? (
                  <ChevronDown size={14} className="folder-arrow" />
                ) : (
                  <ChevronRight size={14} className="folder-arrow" />
                )
              ) : (
                <span className="arrow-placeholder" />
              )}
            </span>

            <span className="node-icon">
              {getFileIcon(node.name, isFolder, node.isExpanded)}
            </span>

            <span className="node-name" title={node.path}>
              {node.name}
            </span>

            <div className="node-actions" onClick={(e) => e.stopPropagation()}>
              {isFolder && (
                <>
                  <button
                    className="action-icon-btn"
                    title="New File inside folder"
                    onClick={() => handleStartCreation('file', node.id)}
                  >
                    <FilePlus size={13} />
                  </button>
                  <button
                    className="action-icon-btn"
                    title="New Subfolder"
                    onClick={() => handleStartCreation('folder', node.id)}
                  >
                    <FolderPlus size={13} />
                  </button>
                </>
              )}
              <button
                className="action-icon-btn delete-btn"
                title={`Delete ${node.name}`}
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${node.name}"?`)) {
                    onDeleteNode(node.id);
                  }
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Creation input inside folder */}
          {isCreating && creationParentId === node.id && (
            <div
              className="tree-node creation-input-row"
              style={{ paddingLeft: `${14 + (depth + 1) * 16}px` }}
            >
              <span className="node-icon">
                {isCreating === 'folder'
                  ? getFileIcon('', true, false)
                  : getFileIcon(newItemName || 'file.txt', false)}
              </span>
              <input
                type="text"
                className="tree-create-input"
                autoFocus
                placeholder={isCreating === 'file' ? 'filename.ts' : 'folder-name'}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onBlur={handleFinishCreation}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          {isFolder && node.isExpanded && node.children && (
            <div className="tree-children">{renderTree(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="sidebar-file-explorer">
      <div className="explorer-header">
        <span className="explorer-title">EXPLORER</span>
        <div className="explorer-actions">
          <button
            className="header-tool-btn"
            title="New File at Root"
            onClick={() => handleStartCreation('file', null)}
          >
            <FilePlus size={14} />
          </button>
          <button
            className="header-tool-btn"
            title="New Folder at Root"
            onClick={() => handleStartCreation('folder', null)}
          >
            <FolderPlus size={14} />
          </button>
          <button
            className="header-tool-btn"
            title="Collapse All Folders"
            onClick={onCollapseAll}
          >
            <Minimize2 size={14} />
          </button>
        </div>
      </div>

      <div className="tree-content">
        {/* Creation input at root */}
        {isCreating && creationParentId === null && (
          <div className="tree-node creation-input-row" style={{ paddingLeft: '14px' }}>
            <span className="node-icon">
              {isCreating === 'folder'
                ? getFileIcon('', true, false)
                : getFileIcon(newItemName || 'file.ts', false)}
            </span>
            <input
              type="text"
              className="tree-create-input"
              autoFocus
              placeholder={isCreating === 'file' ? 'file.ts' : 'folder-name'}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={handleFinishCreation}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        {files.length === 0 && !isCreating ? (
          <div className="empty-tree-notice">
            <p>No files in workspace</p>
          </div>
        ) : (
          renderTree(files)
        )}
      </div>
    </div>
  );
};
