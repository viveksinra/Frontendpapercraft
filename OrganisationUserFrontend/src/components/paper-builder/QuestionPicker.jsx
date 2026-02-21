'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

export default function QuestionPicker({ selectedIds = [], onAdd }) {
  const companyId = getActiveCompanyIdFromCookie();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    if (!companyId) return;
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const params = { page: 1, limit: 50, status: 'approved' };
        if (search) params.search = search;
        if (typeFilter !== 'all') params.type = typeFilter;
        if (difficultyFilter !== 'all') params.difficulty = difficultyFilter;

        // Use question bank endpoint from Phase 1
        const url = backendUrl(`/api/v2/companies/${companyId}/questions`);
        const res = await axios.get(url, { params, headers: { 'X-Company-ID': companyId } });
        setQuestions(res.data?.questions || res.data?.data || []);
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchQuestions, 300);
    return () => clearTimeout(timer);
  }, [companyId, search, typeFilter, difficultyFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="mcq">MCQ</SelectItem>
            <SelectItem value="short-answer">Short Answer</SelectItem>
            <SelectItem value="long-answer">Long Answer</SelectItem>
            <SelectItem value="true-false">True/False</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : questions.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground text-sm">No questions found.</p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {questions.map((q) => {
            const id = q._id || q.id;
            const isSelected = selectedIds.includes(id);
            return (
              <Card key={id} className={isSelected ? 'opacity-50' : ''}>
                <CardContent className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{q.content?.text || q.title || 'Question'}</p>
                    <div className="flex gap-1.5 mt-1">
                      {q.type && <Badge variant="outline" className="text-[10px]">{q.type}</Badge>}
                      {q.difficulty && <Badge variant="outline" className="text-[10px]">{q.difficulty}</Badge>}
                      {q.marks && <Badge variant="secondary" className="text-[10px]">{q.marks} marks</Badge>}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isSelected}
                    onClick={() => onAdd?.(q)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
