import React, { useEffect, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  fileId: string | null;
  filename: string;
  code: string;
  language: string;
  onChange: (newCode: string) => void;
  onSave: () => void;
  onCursorChange?: (line: number, column: number) => void;
}

type StandaloneEditor = Parameters<OnMount>[0];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  fileId,
  filename,
  code,
  language,
  onChange,
  onSave,
  onCursorChange,
}) => {
  const editorRef = useRef<StandaloneEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e: { position: { lineNumber: number; column: number } }) => {
      if (onCursorChange) {
        onCursorChange(e.position.lineNumber, e.position.column);
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave();
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave]);

  if (!fileId) {
    return (
      <div className="editor-empty-state">
        <div className="empty-state-content">
          <p className="empty-title">No file is open</p>
          <p className="empty-subtitle">Select a file from the explorer on the left or create a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="monaco-wrapper">
      <Editor
        key={fileId}
        height="100%"
        width="100%"
        path={filename}
        language={language}
        value={code}
        theme="vs-dark"
        onChange={(val) => onChange(val ?? '')}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          lineHeight: 22,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          minimap: { enabled: true, maxColumn: 80 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          renderWhitespace: 'selection',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          bracketPairColorization: { enabled: true },
          folding: true,
          suggestOnTriggerCharacters: true,
        }}
      />
    </div>
  );
};
