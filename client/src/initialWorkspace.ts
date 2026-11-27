import type { FileNode } from './types/fileSystem';

export const initialWorkspaceFiles: FileNode[] = [
  {
    id: 'src-folder',
    name: 'src',
    path: '/src',
    type: 'folder',
    isExpanded: true,
    children: [
      {
        id: 'index-ts',
        name: 'index.ts',
        path: '/src/index.ts',
        type: 'file',
        language: 'typescript',
        content: `// Welcome to the Sandboxed Cloud IDE
import { calculateMetrics, formatOutput } from './math';

function main() {
  console.log("=== Sandboxed Execution Platform ===");
  const numbers = [10, 25, 42, 88, 105];
  
  const metrics = calculateMetrics(numbers);
  console.log(formatOutput(metrics));
}

main();
`,
      },
      {
        id: 'math-ts',
        name: 'math.ts',
        path: '/src/math.ts',
        type: 'file',
        language: 'typescript',
        content: `export interface Metrics {
  count: number;
  sum: number;
  average: number;
  max: number;
}

export function calculateMetrics(data: number[]): Metrics {
  if (data.length === 0) {
    return { count: 0, sum: 0, average: 0, max: 0 };
  }
  
  const sum = data.reduce((acc, curr) => acc + curr, 0);
  const max = Math.max(...data);
  const average = sum / data.length;

  return { count: data.length, sum, average, max };
}

export function formatOutput(m: Metrics): string {
  return \`Results: \${m.count} items | Sum: \${m.sum} | Avg: \${m.average.toFixed(2)} | Max: \${m.max}\`;
}
`,
      },
    ],
  },
  {
    id: 'package-json',
    name: 'package.json',
    path: '/package.json',
    type: 'file',
    language: 'json',
    content: `{
  "name": "ephemeral-sandbox-app",
  "version": "1.0.0",
  "main": "src/index.ts",
  "scripts": {
    "start": "ts-node src/index.ts",
    "test": "echo \\"Running sandbox test suite...\\""
  },
  "dependencies": {
    "typescript": "^5.4.0"
  }
}
`,
  },
  {
    id: 'readme-md',
    name: 'README.md',
    path: '/README.md',
    type: 'file',
    language: 'markdown',
    content: `# Distributed Cloud IDE

A low-latency, sandboxed development workspace running in your browser.

## Features
- **Monaco Editor:** Desktop-grade editor with full syntax highlighting.
- **Multi-File Tab Switching:** Edit multiple files concurrently with unsaved state tracking.
- **Virtual File Tree:** Create, rename, delete, and organize project files.
- **Upcoming:** Ephemeral Docker containers, interactive xterm.js terminal, and real-time collaboration.
`,
  },
];
