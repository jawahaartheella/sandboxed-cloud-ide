export type FileType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: FileType;
  content?: string;
  language?: string;
  children?: FileNode[];
  isExpanded?: boolean;
}

export interface EditorTab {
  id: string;
  fileId: string;
  name: string;
  path: string;
  language: string;
  isDirty?: boolean;
}
