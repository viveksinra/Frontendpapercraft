'use client';

import { Loader2 } from 'lucide-react';

import StudentProgressRow from './StudentProgressRow';

export default function StudentProgressTable({ students = [], loading = false }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No students connected yet.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
              Student
            </th>
            <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
              Status
            </th>
            <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
              Section
            </th>
            <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
              Progress
            </th>
            <th className="text-foreground h-10 px-2 text-right align-middle font-medium whitespace-nowrap">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {students.map((student) => (
            <StudentProgressRow
              key={student.studentId ?? student._id ?? student.studentEmail}
              student={student}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
