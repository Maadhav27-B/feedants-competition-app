import { useState, useEffect, useCallback } from 'react';
import { competitionService } from '../services/apiService';

export const useCompetition = (competitionId) => {
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompetition = useCallback(
    async (isRefresh = false) => {
      if (!competitionId) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const response = await competitionService.getCompetitionById(competitionId);
        if (response.success) {
          setCompetition(response.data);
        } else {
          setError(response.message || 'Failed to load competition');
        }
      } catch (err) {
        console.error('Error fetching competition', err);
        const message = err.response?.data?.message || err.message || 'Network error occurred';
        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [competitionId]
  );

  useEffect(() => {
    fetchCompetition();
  }, [fetchCompetition]);

  const register = async () => {
    if (!competitionId) return;
    setActionLoading(true);
    setError(null);

    try {
      const response = await competitionService.register(competitionId);
      if (response.success) {
        setCompetition(response.data);
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message, code: response.code };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      const code = err.response?.data?.code || 'REGISTRATION_ERROR';
      setError(message);
      return { success: false, message, code };
    } finally {
      setActionLoading(false);
    }
  };

  const unregister = async () => {
    if (!competitionId) return;
    setActionLoading(true);
    setError(null);

    try {
      const response = await competitionService.unregister(competitionId);
      if (response.success) {
        setCompetition(response.data);
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Unregistration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    competition,
    loading,
    refreshing,
    actionLoading,
    error,
    refresh: () => fetchCompetition(true),
    register,
    unregister
  };
};
