import React from 'react';
import { X } from 'lucide-react';
import type { EditorTab } from '../../types/fileSystem';
import { getFileIcon } from '../../utils/fileIcons';

interface TabBarProps {
  tabs: EditorTab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string, e: React.MouseEvent) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
}) => {
  if (tabs.length === 0) {
    return <div className="tabs-bar empty" />;
  }

  return (
    <div className="tabs-bar">
      <div className="tabs-list">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              className={`editor-tab ${isActive ? 'active' : ''} ${tab.isDirty ? 'dirty' : ''}`}
              onClick={() => onSelectTab(tab.id)}
              onAuxClick={(e) => {
                if (e.button === 1) {
                  e.preventDefault();
                  onCloseTab(tab.id, e);
                }
              }}
              title={tab.path}
            >
              <span className="tab-icon">{getFileIcon(tab.name, false)}</span>
              <span className="tab-title">{tab.name}</span>
              
              <button
                className="tab-close-btn"
                onClick={(e) => onCloseTab(tab.id, e)}
                title="Close (Ctrl+W)"
                aria-label={`Close ${tab.name}`}
              >
                {tab.isDirty ? (
                  <span className="dirty-indicator" title="Unsaved changes">●</span>
                ) : (
                  <X size={13} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
