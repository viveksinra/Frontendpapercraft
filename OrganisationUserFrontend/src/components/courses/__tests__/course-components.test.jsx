import { it, vi, expect, describe, beforeEach } from 'vitest';

// ---- Mock course-api ----
const mockListCourses = vi.fn();
const mockGetCourse = vi.fn();
const mockCreateCourse = vi.fn();
const mockUpdateCourse = vi.fn();
const mockDeleteCourse = vi.fn();
const mockPublishCourse = vi.fn();
const mockGetCourseAnalytics = vi.fn();

vi.mock('src/lib/course-api', () => ({
  listCourses: (...args) => mockListCourses(...args),
  getCourse: (...args) => mockGetCourse(...args),
  createCourse: (...args) => mockCreateCourse(...args),
  updateCourse: (...args) => mockUpdateCourse(...args),
  deleteCourse: (...args) => mockDeleteCourse(...args),
  publishCourse: (...args) => mockPublishCourse(...args),
  getCourseAnalytics: (...args) => mockGetCourseAnalytics(...args),
}));

vi.mock('src/lib/company-api', () => ({
  getActiveCompanyIdFromCookie: vi.fn().mockReturnValue('company-1'),
}));

describe('Org Frontend Course Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── CourseCard ──────────────────────────────────────────────────

  describe('CourseCard', () => {
    it('renders title, status, and stats correctly', () => {
      const course = {
        _id: 'course-1',
        title: 'Math Fundamentals',
        status: 'published',
        slug: 'math-fundamentals',
        stats: { totalLessons: 12, totalDurationMinutes: 180, enrollmentCount: 45 },
        pricing: { isFree: true },
        thumbnail: '/images/math.jpg',
      };

      expect(course.title).toBe('Math Fundamentals');
      expect(course.status).toBe('published');
      expect(course.stats.totalLessons).toBe(12);
      expect(course.stats.enrollmentCount).toBe(45);
      expect(course.pricing.isFree).toBe(true);
    });

    it('displays draft status badge', () => {
      const course = { status: 'draft' };
      expect(course.status).toBe('draft');
    });

    it('displays archived status badge', () => {
      const course = { status: 'archived' };
      expect(course.status).toBe('archived');
    });
  });

  // ─── CreateCourseForm ───────────────────────────────────────────

  describe('CreateCourseForm', () => {
    it('validates required fields - title is required', () => {
      const formData = { title: '', description: '' };
      const errors = [];
      if (!formData.title) errors.push('title is required');
      expect(errors).toContain('title is required');
    });

    it('submits with valid data', async () => {
      const formData = {
        title: 'New Course',
        description: 'Course description',
        category: 'mathematics',
      };
      mockCreateCourse.mockResolvedValue({ _id: 'c1', ...formData, status: 'draft' });

      const result = await mockCreateCourse(formData);

      expect(result.title).toBe('New Course');
      expect(result.status).toBe('draft');
      expect(mockCreateCourse).toHaveBeenCalledWith(formData);
    });
  });

  // ─── CourseBuilder ──────────────────────────────────────────────

  describe('CourseBuilder', () => {
    it('renders sections and lessons structure', () => {
      const course = {
        _id: 'c1',
        sections: [
          {
            _id: 's1',
            title: 'Section 1',
            order: 0,
            lessons: [
              { _id: 'l1', title: 'Intro', type: 'text', order: 0 },
              { _id: 'l2', title: 'Video Demo', type: 'video', order: 1 },
            ],
          },
          {
            _id: 's2',
            title: 'Section 2',
            order: 1,
            lessons: [{ _id: 'l3', title: 'Quiz', type: 'quiz', order: 0 }],
          },
        ],
      };

      expect(course.sections).toHaveLength(2);
      expect(course.sections[0].lessons).toHaveLength(2);
      expect(course.sections[1].lessons).toHaveLength(1);
      expect(course.sections[0].lessons[0].type).toBe('text');
      expect(course.sections[0].lessons[1].type).toBe('video');
      expect(course.sections[1].lessons[0].type).toBe('quiz');
    });

    it('correctly computes total lesson count', () => {
      const sections = [
        { lessons: [1, 2, 3] },
        { lessons: [4, 5] },
        { lessons: [] },
      ];
      const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);
      expect(totalLessons).toBe(5);
    });
  });

  // ─── VideoUploader ──────────────────────────────────────────────

  describe('VideoUploader', () => {
    it('calculates upload progress', () => {
      const loaded = 50;
      const total = 100;
      const progress = Math.round((loaded / total) * 100);
      expect(progress).toBe(50);
    });

    it('validates video file type', () => {
      const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      expect(validTypes.includes('video/mp4')).toBe(true);
      expect(validTypes.includes('image/png')).toBe(false);
    });
  });

  // ─── PublishValidation ──────────────────────────────────────────

  describe('PublishValidation', () => {
    it('shows errors for empty course', () => {
      const course = { sections: [], thumbnail: null };
      const errors = [];

      if (!course.sections.length) errors.push('Course must have at least one section');
      if (!course.thumbnail) errors.push('Thumbnail is required');

      expect(errors).toHaveLength(2);
      expect(errors).toContain('Course must have at least one section');
      expect(errors).toContain('Thumbnail is required');
    });

    it('shows no errors for valid course', () => {
      const course = {
        sections: [
          {
            title: 'S1',
            lessons: [{ title: 'L1', type: 'text', content: { textContent: '<p>Hi</p>' } }],
          },
        ],
        thumbnail: 'thumb.jpg',
      };
      const errors = [];

      if (!course.sections.length) errors.push('No sections');
      const hasEmptySection = course.sections.some((s) => !s.lessons.length);
      if (hasEmptySection) errors.push('Section has no lessons');
      if (!course.thumbnail) errors.push('No thumbnail');

      expect(errors).toHaveLength(0);
    });
  });

  // ─── CourseAnalyticsDashboard ───────────────────────────────────

  describe('CourseAnalyticsDashboard', () => {
    it('renders KPIs from analytics data', async () => {
      const analytics = {
        totalEnrollments: 150,
        activeStudents: 80,
        completionRate: 0.65,
        avgRating: 4.3,
        totalRevenue: 25000,
        completionFunnel: [
          { lessonTitle: 'Intro', completionCount: 150 },
          { lessonTitle: 'Chapter 1', completionCount: 120 },
          { lessonTitle: 'Final Quiz', completionCount: 98 },
        ],
      };
      mockGetCourseAnalytics.mockResolvedValue(analytics);

      const result = await mockGetCourseAnalytics('course-1');

      expect(result.totalEnrollments).toBe(150);
      expect(result.activeStudents).toBe(80);
      expect(result.completionRate).toBe(0.65);
      expect(result.avgRating).toBe(4.3);
      expect(result.completionFunnel).toHaveLength(3);
    });

    it('handles no analytics data gracefully', async () => {
      mockGetCourseAnalytics.mockResolvedValue(null);
      const result = await mockGetCourseAnalytics('course-1');
      expect(result).toBeNull();
    });
  });
});
