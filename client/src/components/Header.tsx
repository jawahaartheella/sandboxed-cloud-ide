import React from 'react';
import { Play, Save, User, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onSave: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  onRun?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSave,
  isSaving = false,
  hasUnsavedChanges = false,
  onRun,
}) => {
  return (
    <header className="ide-header">
      <div className="header-left">
        <div className="app-badge">
          <span className="app-title">CloudIDE</span>
          <span className="workspace-badge">workspace-default</span>
        </div>
      </div>

      <div className="header-center">
        <button
          className="header-action-btn run-btn"
          onClick={onRun}
          title="Run code in sandbox (Container setup scheduled)"
        >
          <Play size={14} className="fill-current" />
          <span>Run</span>
        </button>

        <button
          className={`header-action-btn save-btn ${hasUnsavedChanges ? 'unsaved' : ''}`}
          onClick={onSave}
          disabled={isSaving}
          title="Save all changes (Ctrl+S)"
        >
          <Save size={14} />
          <span>{isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save *' : 'Saved'}</span>
        </button>
      </div>

      <div className="header-right">
        <div className="sync-status">
          <CheckCircle2 size={13} style={{ color: '#4ec9b0' }} />
          <span>Local Sync</span>
        </div>

        <button
          className="header-action-btn signin-btn"
          onClick={() => alert('Account authentication will link this workspace to your MongoDB profile.')}
          title="Sign in to persist workspaces to cloud"
        >
          <User size={14} />
          <span>Sign In</span>
        </button>
      </div>
    </header>
  );
};
