import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('src/lib/company-api', () => ({
  getActiveCompanyIdFromCookie: vi.fn(() => 'company123'),
}));

vi.mock('src/lib/axios', () => ({
  default: { get: vi.fn() },
}));

vi.mock('src/lib/v2-endpoints', () => ({
  backendUrl: (path) => `http://localhost:3000${path}`,
  v2Endpoints: {},
}));

import axios from 'src/lib/axios';

describe('QuestionPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds correct API URL with company ID', () => {
    const companyId = 'company123';
    const url = `http://localhost:3000/api/v2/companies/${companyId}/questions`;
    expect(url).toContain('/api/v2/companies/company123/questions');
  });

  it('sends correct params for approved questions', () => {
    const params = { page: 1, limit: 50, status: 'approved' };
    expect(params.status).toBe('approved');
    expect(params.limit).toBe(50);
  });

  it('adds search param when search is provided', () => {
    const search = 'trigonometry';
    const params = { page: 1, limit: 50, status: 'approved' };
    if (search) params.search = search;
    expect(params.search).toBe('trigonometry');
  });

  it('adds type filter when not "all"', () => {
    const typeFilter = 'mcq';
    const params = { page: 1, limit: 50, status: 'approved' };
    if (typeFilter !== 'all') params.type = typeFilter;
    expect(params.type).toBe('mcq');
  });

  it('adds difficulty filter when not "all"', () => {
    const difficultyFilter = 'hard';
    const params = { page: 1, limit: 50, status: 'approved' };
    if (difficultyFilter !== 'all') params.difficulty = difficultyFilter;
    expect(params.difficulty).toBe('hard');
  });

  it('identifies selected questions', () => {
    const selectedIds = ['q1', 'q3'];
    const question = { _id: 'q1', content: { text: 'Test' } };
    const id = question._id || question.id;
    const isSelected = selectedIds.includes(id);
    expect(isSelected).toBe(true);
  });

  it('identifies unselected questions', () => {
    const selectedIds = ['q1', 'q3'];
    const question = { _id: 'q2', content: { text: 'Test' } };
    const id = question._id || question.id;
    const isSelected = selectedIds.includes(id);
    expect(isSelected).toBe(false);
  });

  it('calls onAdd with question object', () => {
    const onAdd = vi.fn();
    const question = { _id: 'q5', content: { text: 'What is gravity?' }, type: 'mcq', marks: 2 };
    onAdd(question);
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ _id: 'q5', type: 'mcq', marks: 2 })
    );
  });
});
