'use client';

import { useState } from 'react';
import { Plus, Folder, Pencil, Trash2, FolderOpen, ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const LEVEL_COLORS = {
  subject: 'bg-blue-100 text-blue-800',
  chapter: 'bg-green-100 text-green-800',
  topic: 'bg-orange-100 text-orange-800',
  subtopic: 'bg-purple-100 text-purple-800',
};

export default function SubjectTreeNode({ node, level = 0, onEdit, onAddChild, onDelete }) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-accent/50 group"
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        <button
          type="button"
          className="shrink-0"
          onClick={() => hasChildren && setExpanded(!expanded)}
        >
          {hasChildren ? (
            expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <span className="w-4" />
          )}
        </button>

        {expanded && hasChildren ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}

        <span className="font-medium text-sm">{node.name}</span>

        <Badge variant="outline" className={`${LEVEL_COLORS[node.level] || ''} border-0 text-xs ml-1`}>
          {node.level}
        </Badge>

        {node.questionCount > 0 && (
          <span className="text-xs text-muted-foreground ml-1">({node.questionCount})</span>
        )}

        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(node)}>
                <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddChild?.(node._id)}>
                <Plus className="mr-2 h-3.5 w-3.5" /> Add Child
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(node._id)}>
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <SubjectTreeNode
              key={child._id}
              node={child}
              level={level + 1}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
