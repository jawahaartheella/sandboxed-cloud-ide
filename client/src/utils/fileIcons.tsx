export function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'py':
      return 'python';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    case 'css':
    case 'scss':
      return 'css';
    case 'md':
      return 'markdown';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'sql':
      return 'sql';
    case 'sh':
    case 'bash':
      return 'shell';
    case 'cpp':
    case 'c':
    case 'h':
      return 'cpp';
    default:
      return 'plaintext';
  }
}

import {
  FileCode,
  FileJson,
  FileText,
  FileSpreadsheet,
  Folder,
  FolderOpen,
  File as GenericFile,
} from 'lucide-react';

export function getFileIcon(filename: string, isFolder: boolean, isExpanded = false) {
  if (isFolder) {
    return isExpanded ? (
      <FolderOpen size={16} className="text-folder" style={{ color: '#dcb67a' }} />
    ) : (
      <Folder size={16} className="text-folder" style={{ color: '#dcb67a' }} />
    );
  }

  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return <FileCode size={15} style={{ color: '#3178c6' }} />;
    case 'js':
    case 'jsx':
      return <FileCode size={15} style={{ color: '#f7df1e' }} />;
    case 'py':
      return <FileCode size={15} style={{ color: '#3572A5' }} />;
    case 'json':
      return <FileJson size={15} style={{ color: '#cbcb41' }} />;
    case 'html':
      return <FileCode size={15} style={{ color: '#e34c26' }} />;
    case 'css':
    case 'scss':
      return <FileSpreadsheet size={15} style={{ color: '#563d7c' }} />;
    case 'md':
      return <FileText size={15} style={{ color: '#519aba' }} />;
    default:
      return <GenericFile size={15} style={{ color: '#858585' }} />;
  }
}
