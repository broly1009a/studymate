// Reputation System Utilities
export const REPUTATION_RULES = {
  // Study activities
  study_30min: { points: 5, reason: 'Completed 30-minute study session' },
  study_1hour: { points: 15, reason: 'Completed 1-hour study session' },
  study_2hours: { points: 30, reason: 'Completed 2-hour study session' },
  high_focus: { points: 10, reason: 'Achieved high focus score (80+)' },
  
  // Streaks
  streak_3days: { points: 15, reason: '3-day study streak' },
  streak_7days: { points: 35, reason: '7-day study streak' },
  streak_14days: { points: 70, reason: '14-day study streak' },
  streak_30days: { points: 150, reason: '30-day study streak' },
  streak_60days: { points: 300, reason: '60-day study streak' },
  streak_90days: { points: 500, reason: '90-day study streak' },
  streak_180days: { points: 1000, reason: '180-day study streak' },
  streak_365days: { points: 2500, reason: '365-day study streak' },
  
  // Group sessions
  session_created: { points: 20, reason: 'Organized study session' },
  session_joined: { points: 5, reason: 'Joined study session' },
  session_completed: { points: 10, reason: 'Completed group study session' },
  
  // Pomodoro milestones
  pomodoro_4: { points: 5, reason: 'Completed 4 pomodoros' },
  pomodoro_8: { points: 10, reason: 'Completed 8 pomodoros' },
  pomodoro_12: { points: 15, reason: 'Completed 12 pomodoros' },
  
  // Forum activities (if you have forum)
  question_asked: { points: 5, reason: 'Asked a question' },
  answer_posted: { points: 10, reason: 'Posted an answer' },
  answer_accepted: { points: 25, reason: 'Answer accepted as best' },
  helpful_vote: { points: 2, reason: 'Received helpful vote' },
  
  // Achievements
  achievement_unlocked: { points: 50, reason: 'Unlocked achievement' },
  first_study: { points: 10, reason: 'Completed first study session' },
  
  // Penalties
  spam_reported: { points: -50, reason: 'Content reported as spam' },
  inappropriate_content: { points: -30, reason: 'Inappropriate content' },
  session_no_show: { points: -10, reason: 'No-show at study session' },
} as const;

export type ReputationRuleKey = keyof typeof REPUTATION_RULES;

// Function to award reputation
export async function awardReputation(
  userId: string,
  ruleKey: ReputationRuleKey,
  customData?: { customReason?: string; customPoints?: number }
) {
  const rule = REPUTATION_RULES[ruleKey];
  if (!rule) throw new Error('Invalid reputation rule');

  const reason = customData?.customReason || rule.reason;
  const points = customData?.customPoints || rule.points;

  try {
    const response = await fetch('/api/reputation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        points: Math.abs(points),
        reason,
        type: points > 0 ? 'earned' : 'lost'
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Error awarding reputation:', error);
    throw error;
  }
}

// Get user rank based on reputation
export function getUserRank(reputation: number): string {
  if (reputation >= 10000) return 'Legend';
  if (reputation >= 5000) return 'Master';
  if (reputation >= 2000) return 'Expert';
  if (reputation >= 1000) return 'Advanced';
  if (reputation >= 500) return 'Intermediate';
  if (reputation >= 100) return 'Beginner';
  return 'Novice';
}

// Get rank color
export function getRankColor(rank: string): string {
  const colors: Record<string, string> = {
    Legend: 'text-purple-600',
    Master: 'text-red-600',
    Expert: 'text-blue-600',
    Advanced: 'text-green-600',
    Intermediate: 'text-yellow-600',
    Beginner: 'text-gray-600',
    Novice: 'text-gray-400'
  };
  return colors[rank] || 'text-gray-600';
}

// Get next rank threshold
export function getNextRankThreshold(reputation: number): { rank: string; threshold: number } {
  const ranks = [
    { rank: 'Beginner', threshold: 100 },
    { rank: 'Intermediate', threshold: 500 },
    { rank: 'Advanced', threshold: 1000 },
    { rank: 'Expert', threshold: 2000 },
    { rank: 'Master', threshold: 5000 },
    { rank: 'Legend', threshold: 10000 },
  ];

  for (const rank of ranks) {
    if (reputation < rank.threshold) {
      return rank;
    }
  }

  return { rank: 'Legend', threshold: 10000 };
}

// Calculate rank progress
export function getRankProgress(reputation: number): number {
  const nextRank = getNextRankThreshold(reputation);
  return reputation / nextRank.threshold;
}
