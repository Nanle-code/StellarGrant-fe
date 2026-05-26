/**
 * useMilestone Hook
 *
 * Fetches milestone state for a specific grant + milestone index.
 * Includes vote data and submission proof.
 */

import type { Milestone, MilestoneVote } from "@/types";

interface UseMilestoneReturn {
  milestone: Milestone | null;
  votes: MilestoneVote[];
  isReviewer: boolean;
  hasVoted: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useMilestone(_grantId: string, _milestoneIdx: number): UseMilestoneReturn {
  // TODO: Implement milestone fetching hook
  return {
    milestone: null,
    votes: [] as MilestoneVote[],
    isReviewer: false,
    hasVoted: false,
    isLoading: false,
    error: null,
  };
}
