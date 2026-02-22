'use client';

import SubjectTreeNode from './SubjectTreeNode';

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

export default function SubjectTreeView({ subjects = [], onEdit, onAddChild, onDelete }) {
  const tree = buildTree(subjects);

  if (tree.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No subjects yet. Create your first subject to organize your question bank.
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {tree.map((node) => (
        <SubjectTreeNode
          key={node._id}
          node={node}
          onEdit={onEdit}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
