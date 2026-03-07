'use client';

import { useState } from 'react';
import { Folder, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';

function buildTree(subjects) {
  const map = {};
  const roots = [];
  for (const s of subjects) {
    map[s._id] = { ...s, children: [] };
  }
  for (const s of subjects) {
    if (s.parentId && map[s.parentId]) {
      map[s.parentId].children.push(map[s._id]);
    } else {
      roots.push(map[s._id]);
    }
  }
  return roots;
}

function TreeNode({ node, selectedId, onSelect, level = 0 }) {
  const [expanded, setExpanded] = useState(level === 0);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node._id;

  return (
    <div>
      <button
        type="button"
        className={`flex items-center gap-1.5 w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors ${isSelected ? 'bg-accent font-medium' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          onSelect(isSelected ? null : node._id);
          if (hasChildren) setExpanded(!expanded);
        }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <span className="w-3.5" />
        )}
        {expanded && hasChildren ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">{node.name}</span>
        {node.questionCount > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">{node.questionCount}</span>
        )}
      </button>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child._id} node={child} selectedId={selectedId} onSelect={onSelect} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubjectTreeSidebar({ subjects = [], selectedSubjectId, onSubjectSelect }) {
  const tree = buildTree(subjects);

  return (
    <div className="w-64 shrink-0 border-r pr-3 overflow-y-auto max-h-[calc(100vh-16rem)]">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-1">Subjects</h3>
        <button
          type="button"
          className={`flex items-center gap-1.5 w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors ${!selectedSubjectId ? 'bg-accent font-medium' : ''}`}
          onClick={() => onSubjectSelect(null)}
        >
          All Subjects
        </button>
      </div>
      {tree.map((node) => (
        <TreeNode
          key={node._id}
          node={node}
          selectedId={selectedSubjectId}
          onSelect={onSubjectSelect}
        />
      ))}
      {tree.length === 0 && (
        <p className="text-xs text-muted-foreground px-2 py-4">No subjects yet.</p>
      )}
    </div>
  );
}
