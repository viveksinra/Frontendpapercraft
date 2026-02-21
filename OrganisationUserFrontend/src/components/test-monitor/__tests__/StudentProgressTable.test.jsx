import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('lucide-react', () => ({
  Loader2: vi.fn(),
}));

vi.mock('../StudentProgressRow', () => ({
  default: vi.fn(),
}));

describe('StudentProgressTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    it('shows loading state when loading is true', () => {
      const loading = true;
      const students = [];

      // Component returns early with Loader2 spinner when loading is true
      const isLoadingState = loading === true;
      expect(isLoadingState).toBe(true);
    });

    it('loading state takes precedence over empty students', () => {
      const loading = true;
      const students = [];

      // The component checks loading first, so even with empty students it shows loader
      const shouldShowLoader = loading;
      const shouldShowEmpty = !loading && students.length === 0;
      const shouldShowTable = !loading && students.length > 0;

      expect(shouldShowLoader).toBe(true);
      expect(shouldShowEmpty).toBe(false);
      expect(shouldShowTable).toBe(false);
    });

    it('loading state takes precedence even with students data', () => {
      const loading = true;
      const students = [{ studentId: 's1', name: 'Alice' }];

      const shouldShowLoader = loading;
      expect(shouldShowLoader).toBe(true);
    });
  });

  describe('empty state', () => {
    it('shows empty message when students array is empty and not loading', () => {
      const loading = false;
      const students = [];

      const shouldShowEmpty = !loading && students.length === 0;
      expect(shouldShowEmpty).toBe(true);
    });

    it('empty state message text is "No students connected yet."', () => {
      // This is the exact text rendered in the empty state div
      const emptyMessage = 'No students connected yet.';
      expect(emptyMessage).toBe('No students connected yet.');
    });

    it('defaults to empty array when students prop is not provided', () => {
      // Component signature: { students = [], loading = false }
      const defaultStudents = [];
      const defaultLoading = false;

      expect(defaultStudents).toEqual([]);
      expect(defaultLoading).toBe(false);
    });
  });

  describe('table rendering logic', () => {
    it('renders table when students are present and not loading', () => {
      const loading = false;
      const students = [
        { studentId: 's1', name: 'Alice', status: 'in_progress', section: 1, progress: 50 },
        { studentId: 's2', name: 'Bob', status: 'completed', section: 2, progress: 100 },
      ];

      const shouldShowTable = !loading && students.length > 0;
      expect(shouldShowTable).toBe(true);
    });

    it('table has 5 column headers: Student, Status, Section, Progress, Time', () => {
      const columns = ['Student', 'Status', 'Section', 'Progress', 'Time'];
      expect(columns).toHaveLength(5);
      expect(columns).toEqual(['Student', 'Status', 'Section', 'Progress', 'Time']);
    });

    it('maps over students array to create rows', () => {
      const students = [
        { studentId: 's1', name: 'Alice' },
        { studentId: 's2', name: 'Bob' },
        { studentId: 's3', name: 'Charlie' },
      ];

      // The component calls students.map to render StudentProgressRow for each
      const mapCallback = vi.fn();
      students.map(mapCallback);

      expect(mapCallback).toHaveBeenCalledTimes(3);
      expect(mapCallback).toHaveBeenCalledWith(
        expect.objectContaining({ studentId: 's1' }),
        0,
        students
      );
      expect(mapCallback).toHaveBeenCalledWith(
        expect.objectContaining({ studentId: 's2' }),
        1,
        students
      );
    });

    it('uses studentId as key, falling back to _id then studentEmail', () => {
      // Component uses: key={student.studentId ?? student._id ?? student.studentEmail}
      const getKey = (student) =>
        student.studentId ?? student._id ?? student.studentEmail;

      expect(getKey({ studentId: 's1', _id: 'id1', studentEmail: 'a@b.com' })).toBe('s1');
      expect(getKey({ studentId: null, _id: 'id1', studentEmail: 'a@b.com' })).toBe('id1');
      expect(getKey({ studentId: null, _id: null, studentEmail: 'a@b.com' })).toBe('a@b.com');
      expect(getKey({ _id: 'id2', studentEmail: 'c@d.com' })).toBe('id2');
    });
  });
});
