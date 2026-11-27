import React from 'react';
import { GitBranch } from 'lucide-react';

interface StatusBarProps {
  activeLanguage?: string;
  cursorLine: number;
  cursorColumn: number;
  activeFilePath?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeLanguage = 'Plain Text',
  cursorLine = 1,
  cursorColumn = 1,
  activeFilePath = '',
}) => {
  return (
    <footer className="ide-status-bar">
      <div className="status-left">
        <div className="status-item branch-item" title="Current git branch">
          <GitBranch size={12} />
          <span>week1</span>
        </div>
        <div className="status-item sandbox-status" title="Docker Sandbox status">
          <span className="status-dot standby" />
          <span>Sandbox: Standby</span>
        </div>
        {activeFilePath && (
          <div className="status-item file-path-item" title={activeFilePath}>
            <span>{activeFilePath}</span>
          </div>
        )}
      </div>

      <div className="status-right">
        <div className="status-item cursor-item">
          <span>Ln {cursorLine}, Col {cursorColumn}</span>
        </div>
        <div className="status-item">
          <span>Spaces: 2</span>
        </div>
        <div className="status-item">
          <span>UTF-8</span>
        </div>
        <div className="status-item language-item">
          <span>{activeLanguage}</span>
        </div>
      </div>
    </footer>
  );
};
