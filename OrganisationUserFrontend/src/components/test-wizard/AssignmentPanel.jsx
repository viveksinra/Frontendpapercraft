'use client';

import { Globe, Users, Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        checked ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function AssignmentPanel({ assignment, onChange }) {
  const isPublic = assignment?.isPublic ?? false;
  const selectedClasses = assignment?.classes || [];
  const selectedStudents = assignment?.students || [];

  const totalAssigned = isPublic
    ? 'All students (public)'
    : `${selectedClasses.length} class(es), ${selectedStudents.length} student(s)`;

  const handleTogglePublic = (value) => {
    onChange({ ...assignment, isPublic: value });
  };

  const handleRemoveClass = (classId) => {
    onChange({
      ...assignment,
      classes: selectedClasses.filter((c) => c.id !== classId),
    });
  };

  const handleRemoveStudent = (studentId) => {
    onChange({
      ...assignment,
      students: selectedStudents.filter((s) => s.id !== studentId),
    });
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold">Assignment</h3>

      {/* Public toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Make public</p>
            <p className="text-xs text-muted-foreground">
              All students in your organisation can access this test
            </p>
          </div>
        </div>
        <ToggleSwitch checked={isPublic} onChange={handleTogglePublic} />
      </div>

      {/* Class multi-select */}
      {!isPublic && (
        <>
          <div className="space-y-3">
            <Label>Assign to Classes</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search classes..."
              />
            </div>
            {selectedClasses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedClasses.map((cls) => (
                  <Badge key={cls.id} variant="secondary" className="gap-1 pr-1">
                    <Users className="h-3 w-3" />
                    {cls.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(cls.id)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No classes selected. Search and select classes above.
              </p>
            )}
          </div>

          {/* Student search */}
          <div className="space-y-3">
            <Label>Add Individual Students</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search students by name or email..."
              />
            </div>
            {selectedStudents.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedStudents.map((student) => (
                  <Badge key={student.id} variant="outline" className="gap-1 pr-1">
                    {student.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(student.id)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No individual students added. Search and add students above.
              </p>
            )}
          </div>
        </>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between rounded-md bg-muted px-4 py-2.5">
        <span className="text-sm text-muted-foreground">Total assigned</span>
        <span className="text-sm font-medium">{totalAssigned}</span>
      </div>
    </div>
  );
}
