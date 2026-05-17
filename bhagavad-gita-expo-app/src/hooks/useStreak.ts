import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userApi from '../services/userApi';
import type { ApiStreak, ApiActivity, ApiUserMilestone } from '../types/api';

export const streakKeys = {
  streak: ['streak'] as const,
  activity: (days?: number) => ['activity', days ?? 30] as const,
  milestones: ['userMilestones'] as const,
  verseProgress: (chapter?: number) => ['verseProgress', chapter ?? 'all'] as const,
  chapterProgress: ['chapterProgress'] as const,
};

export function useStreak() {
  return useQuery<{ streak: ApiStreak }, Error>({
    queryKey: streakKeys.streak,
    queryFn: () => userApi.getStreak(),
    staleTime: 1000 * 30,
  });
}

export function useActivity(days = 30) {
  return useQuery<{ activity: ApiActivity[]; days: number }, Error>({
    queryKey: streakKeys.activity(days),
    queryFn: () => userApi.getActivity(days),
    staleTime: 1000 * 30,
  });
}

export function useUserMilestones() {
  return useQuery<{ milestones: ApiUserMilestone[] }, Error>({
    queryKey: streakKeys.milestones,
    queryFn: () => userApi.getUserMilestones(),
    staleTime: 1000 * 60,
  });
}

export function useVerseProgress(chapter?: number) {
  return useQuery({
    queryKey: streakKeys.verseProgress(chapter),
    queryFn: () => userApi.getVerseProgress(chapter),
    staleTime: 1000 * 30,
  });
}

export function useChapterProgress() {
  return useQuery({
    queryKey: streakKeys.chapterProgress,
    queryFn: () => userApi.getChapterProgress(),
    staleTime: 1000 * 30,
  });
}

export function useRecordProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chapterNumber,
      verseNumber,
      status,
      timeSpentSecs,
    }: {
      chapterNumber: number;
      verseNumber: number;
      status: 'read' | 'in_progress' | 'completed' | 'mastered';
      timeSpentSecs?: number;
    }) => userApi.recordVerseProgress(chapterNumber, verseNumber, status, timeSpentSecs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: streakKeys.streak });
      queryClient.invalidateQueries({ queryKey: streakKeys.verseProgress() });
      queryClient.invalidateQueries({ queryKey: streakKeys.chapterProgress });
      queryClient.invalidateQueries({ queryKey: streakKeys.milestones });
    },
  });
}
