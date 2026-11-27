import { useState, useCallback, useMemo } from 'react';
import { FileTree } from './components/Sidebar/FileTree';
import { TabBar } from './components/Editor/TabBar';
import { CodeEditor } from './components/Editor/CodeEditor';
import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import type { FileNode, EditorTab } from './types/fileSystem';
import { initialWorkspaceFiles } from './initialWorkspace';
import { getLanguageFromFilename } from './utils/fileIcons';

function findNodeById(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function updateNodeContent(nodes: FileNode[], fileId: string, newContent: string): FileNode[] {
  return nodes.map((node) => {
    if (node.id === fileId) {
      return { ...node, content: newContent };
    }
    if (node.children) {
      return { ...node, children: updateNodeContent(node.children, fileId, newContent) };
    }
    return node;
  });
}

function insertNode(nodes: FileNode[], parentId: string | null, newNode: FileNode): FileNode[] {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  return nodes.map((node) => {
    if (node.id === parentId && node.type === 'folder') {
      return {
        ...node,
        isExpanded: true,
        children: [...(node.children || []), newNode],
      };
    }
    if (node.children) {
      return { ...node, children: insertNode(node.children, parentId, newNode) };
    }
    return node;
  });
}

function removeNode(nodes: FileNode[], nodeId: string): FileNode[] {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => {
      if (node.children) {
        return { ...node, children: removeNode(node.children, nodeId) };
      }
      return node;
    });
}

function toggleFolderState(nodes: FileNode[], folderId: string): FileNode[] {
  return nodes.map((node) => {
    if (node.id === folderId) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    if (node.children) {
      return { ...node, children: toggleFolderState(node.children, folderId) };
    }
    return node;
  });
}

function collapseAllFolders(nodes: FileNode[]): FileNode[] {
  return nodes.map((node) => {
    const updated = { ...node, isExpanded: false };
    if (updated.children) {
      updated.children = collapseAllFolders(updated.children);
    }
    return updated;
  });
}

export function App() {
  const [files, setFiles] = useState<FileNode[]>(() => {
    const saved = localStorage.getItem('cloud_ide_workspace');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialWorkspaceFiles;
      }
    }
    return initialWorkspaceFiles;
  });

  const [tabs, setTabs] = useState<EditorTab[]>([
    {
      id: 'index-ts',
      fileId: 'index-ts',
      name: 'index.ts',
      path: '/src/index.ts',
      language: 'typescript',
      isDirty: false,
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string | null>('index-ts');
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [isSaving, setIsSaving] = useState(false);

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) || null,
    [tabs, activeTabId]
  );

  const activeFile = useMemo(() => {
    if (!activeTab) return null;
    return findNodeById(files, activeTab.fileId);
  }, [files, activeTab]);

  const hasUnsavedChanges = useMemo(() => tabs.some((t) => t.isDirty), [tabs]);

  const handleSelectFile = useCallback((file: FileNode) => {
    if (file.type === 'folder') return;

    setTabs((prevTabs) => {
      const exists = prevTabs.find((t) => t.fileId === file.id);
      if (exists) return prevTabs;

      const newTab: EditorTab = {
        id: file.id,
        fileId: file.id,
        name: file.name,
        path: file.path,
        language: file.language || getLanguageFromFilename(file.name),
        isDirty: false,
      };
      return [...prevTabs, newTab];
    });

    setActiveTabId(file.id);
  }, []);

  const handleCloseTab = useCallback(
    (tabId: string, e: React.MouseEvent) => {
      e.stopPropagation();

      setTabs((prevTabs) => {
        const tabToClose = prevTabs.find((t) => t.id === tabId);
        if (tabToClose?.isDirty) {
          const discard = confirm(`Save changes to ${tabToClose.name} before closing?`);
          if (discard) handleSave();
        }

        const remaining = prevTabs.filter((t) => t.id !== tabId);

        if (activeTabId === tabId) {
          const index = prevTabs.findIndex((t) => t.id === tabId);
          const nextTab = remaining[index] || remaining[index - 1] || null;
          setActiveTabId(nextTab ? nextTab.id : null);
        }

        return remaining;
      });
    },
    [activeTabId]
  );

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (!activeTab) return;

      setFiles((prev) => updateNodeContent(prev, activeTab.fileId, newCode));
      setTabs((prev) =>
        prev.map((tab) => (tab.id === activeTab.id ? { ...tab, isDirty: true } : tab))
      );
    },
    [activeTab]
  );

  const handleSave = useCallback(() => {
    setIsSaving(true);
    localStorage.setItem('cloud_ide_workspace', JSON.stringify(files));
    setTabs((prev) => prev.map((tab) => ({ ...tab, isDirty: false })));

    setTimeout(() => {
      setIsSaving(false);
    }, 300);
  }, [files]);

  const handleCreateFile = useCallback(
    (name: string, parentFolderId: string | null) => {
      const parentNode = parentFolderId ? findNodeById(files, parentFolderId) : null;
      const parentPath = parentNode ? parentNode.path : '';
      const fullPath = `${parentPath}/${name}`.replace(/\/+/g, '/');

      const newFile: FileNode = {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name,
        path: fullPath,
        type: 'file',
        language: getLanguageFromFilename(name),
        content: `// ${name}\n`,
      };

      setFiles((prev) => insertNode(prev, parentFolderId, newFile));
      handleSelectFile(newFile);
    },
    [files, handleSelectFile]
  );

  const handleCreateFolder = useCallback(
    (name: string, parentFolderId: string | null) => {
      const parentNode = parentFolderId ? findNodeById(files, parentFolderId) : null;
      const parentPath = parentNode ? parentNode.path : '';
      const fullPath = `${parentPath}/${name}`.replace(/\/+/g, '/');

      const newFolder: FileNode = {
        id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name,
        path: fullPath,
        type: 'folder',
        isExpanded: true,
        children: [],
      };

      setFiles((prev) => insertNode(prev, parentFolderId, newFolder));
    },
    [files]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setTabs((prev) => prev.filter((t) => t.fileId !== nodeId));
      if (activeTabId === nodeId) {
        setActiveTabId(null);
      }
      setFiles((prev) => removeNode(prev, nodeId));
    },
    [activeTabId]
  );

  const handleToggleFolder = useCallback((folderId: string) => {
    setFiles((prev) => toggleFolderState(prev, folderId));
  }, []);

  const handleCollapseAll = useCallback(() => {
    setFiles((prev) => collapseAllFolders(prev));
  }, []);

  return (
    <div className="ide-container">
      <Header
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onRun={() => alert('Execution runner: Docker container orchestration scheduled in next module.')}
      />

      <div className="ide-main-body">
        <aside className="ide-sidebar">
          <FileTree
            files={files}
            activeFileId={activeFile?.id || null}
            onSelectFile={handleSelectFile}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
            onDeleteNode={handleDeleteNode}
            onToggleFolder={handleToggleFolder}
            onCollapseAll={handleCollapseAll}
          />
        </aside>

        <main className="ide-editor-area">
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onSelectTab={setActiveTabId}
            onCloseTab={handleCloseTab}
          />

          <div className="editor-container">
            <CodeEditor
              fileId={activeFile?.id || null}
              filename={activeFile?.name || ''}
              code={activeFile?.content || ''}
              language={activeFile?.language || 'plaintext'}
              onChange={handleCodeChange}
              onSave={handleSave}
              onCursorChange={(line, column) => setCursorPos({ line, column })}
            />
          </div>
        </main>
      </div>

      <StatusBar
        activeLanguage={activeFile?.language || 'Plain Text'}
        cursorLine={cursorPos.line}
        cursorColumn={cursorPos.column}
        activeFilePath={activeFile?.path || ''}
      />
    </div>
  );
}

export default App;
