'use client';

import { Radio, Loader2 } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';

import axiosInstance from '@/lib/axios';
import { v2Endpoints } from '@/lib/v2-endpoints';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

import MonitorStatsBar from './MonitorStatsBar';
import EmergencyControls from './EmergencyControls';
import StudentProgressTable from './StudentProgressTable';

function formatCountdown(seconds) {
  if (!seconds && seconds !== 0) return '--:--:--';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function LiveTestMonitor({ testId, companyId }) {
  const [test, setTest] = useState(null);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const intervalRef = useRef(null);
  const pollRef = useRef(null);

  const fetchLiveData = useCallback(async () => {
    if (!testId || !companyId) return undefined;

    try {
      const [statusRes, testRes] = await Promise.all([
        axiosInstance.get(v2Endpoints.onlineTests.liveStatus(companyId, testId)),
        axiosInstance.get(v2Endpoints.onlineTests.detail(companyId, testId)),
      ]);

      const statusData = statusRes.data;
      setStudents(statusData?.students ?? []);
      setStats(statusData?.stats ?? {});
      setTest(testRes.data);

      if (statusData?.timeRemaining != null) {
        setTimeRemaining(statusData.timeRemaining);
      }
    } catch (err) {
      console.error('Failed to fetch live status:', err);
      setError(err.message || 'Failed to load monitor data');
    }
  }, [testId, companyId]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchLiveData();
      setLoading(false);
    };
    init();
  }, [fetchLiveData]);

  // Poll every 5 seconds
  useEffect(() => {
    pollRef.current = setInterval(fetchLiveData, 5000);
    return () => clearInterval(pollRef.current);
  }, [fetchLiveData]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining == null || timeRemaining <= 0) return undefined;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeRemaining]);

  const handleExtendTime = async (minutes) => {
    try {
      await axiosInstance.post(v2Endpoints.onlineTests.extendTime(companyId, testId), { minutes });
      await fetchLiveData();
    } catch (err) {
      console.error('Failed to extend time:', err);
    }
  };

  const handleEndTest = async () => {
    try {
      await axiosInstance.post(v2Endpoints.onlineTests.complete(companyId, testId));
      await fetchLiveData();
    } catch (err) {
      console.error('Failed to end test:', err);
    }
  };

  const handlePause = async () => {
    try {
      await axiosInstance.post(v2Endpoints.onlineTests.pause(companyId, testId));
      await fetchLiveData();
    } catch (err) {
      console.error('Failed to pause test:', err);
    }
  };

  const handleResume = async () => {
    try {
      await axiosInstance.post(v2Endpoints.onlineTests.resume(companyId, testId));
      await fetchLiveData();
    } catch (err) {
      console.error('Failed to resume test:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive font-medium">{error}</p>
        <button className="mt-2 text-sm text-primary underline" onClick={fetchLiveData}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">LIVE</span>
          </div>
          <h2 className="text-xl font-semibold">
            {test?.title || 'Test Monitor'}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Time Remaining</p>
            <p className="text-2xl font-mono font-bold tabular-nums">
              {formatCountdown(timeRemaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <MonitorStatsBar stats={stats} />

      {/* Student Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentProgressTable students={students} />
        </CardContent>
      </Card>

      {/* Emergency Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <EmergencyControls
            test={test}
            onExtendTime={handleExtendTime}
            onEndTest={handleEndTest}
            onPause={handlePause}
            onResume={handleResume}
          />
        </CardContent>
      </Card>
    </div>
  );
}
