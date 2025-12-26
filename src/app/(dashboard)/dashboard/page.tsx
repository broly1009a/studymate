'use client';

import { useAuth } from '@/hooks/use-auth';
import { FindPartnerCTA } from '@/components/dashboard/find-partner-cta';
import { StudyStreakCard } from '@/components/dashboard/study-streak-card';
import { QuickStats } from '@/components/dashboard/quick-stats';
import { TinderEvents } from '@/components/dashboard/tinder-events';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { AIRecommendations } from '@/components/dashboard/ai-recommendations';
import { UpcomingEvents } from '@/components/dashboard/upcoming-events';
import type { DashboardData } from '@/types/dashboard';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/constants';
export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();

  // States for dashboard data
  const [studyStreak, setStudyStreak] = useState({ current: 0, longest: 0, lastStudyDate: '' });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [quickStats, setQuickStats] = useState({
    todayStudyTime: 0,
    weeklyStudyTime: 0,
    questionsAnswered: 0,
    upcomingDeadlines: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [studyGoals, setStudyGoals] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        // Fetch study streak
        const streakResponse = await fetch(`${API_URL}/study-streak?userId=${user.id}`);
        if (streakResponse.ok) {
          const streakData = await streakResponse.json();
          if (streakData.success) {
            setStudyStreak(streakData.data);
          }
        }

        // Fetch recent activities
        const activitiesResponse = await fetch(`${API_URL}/activities?userId=${user.id}&limit=3`);
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData.data || []);
        }

        // Fetch study goals
        const goalsResponse = await fetch(`${API_URL}/goals?userId=${user.id}`);
        if (goalsResponse.ok) {
          const goalsData = await goalsResponse.json();
          setStudyGoals(goalsData.data || []);
        }

        // Fetch upcoming events
        const eventsResponse = await fetch(`${API_URL}/events?limit=5`);
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          if (eventsData.success) {
            setUpcomingEvents(eventsData.data);
          }
        }

        // Fetch featured events (Tinder-like carousel)
        const featuredResponse = await fetch(`${API_URL}/featured-events?limit=3&sortBy=trending`);
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          if (featuredData.success) {
            setFeaturedEvents(featuredData.data);
          }
        }

        // Fetch AI Recommendations
        const recommendationsResponse = await fetch(`${API_URL}/recommendations?userId=${user.id}&limit=3`);
        if (recommendationsResponse.ok) {
          const recommendationsData = await recommendationsResponse.json();
          if (recommendationsData.success) {
            setAiRecommendations(recommendationsData.data);
          }
        }

        // Fetch today schedule (study sessions)
        const scheduleResponse = await fetch(`${API_URL}/study-sessions?userId=${user.id}&date=today&status=scheduled`);
        if (scheduleResponse.ok) {
          const scheduleData = await scheduleResponse.json();
          if (scheduleData.success) {
            setTodaySchedule(scheduleData.data);
          }
        }

        // For now, use mock calculation
        setQuickStats({
          todayStudyTime: 45, // TODO: Calculate from study sessions
          weeklyStudyTime: 320, // TODO: Calculate from study records
          questionsAnswered: 12, // TODO: Calculate from activities
          upcomingDeadlines: studyGoals.length, // Count active goals
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a7c1] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Chào mừng trở lại, <span className="text-[#00a7c1]">{user.fullName || user.username}</span>! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Đây là những gì đang diễn ra với việc học của bạn hôm nay
        </p>
      </div>

      {/* Hero CTA - Tìm bạn học (Eye-catching) */}
      <FindPartnerCTA />

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Quick Stats & Study Streak */}
        <div className="space-y-6">
          <QuickStats stats={quickStats} />
          <StudyStreakCard streak={studyStreak} />
        </div>

        {/* MIDDLE COLUMN (MIDLANE) - Events & Competitions */}
        <div className="space-y-6">
          <UpcomingEvents events={upcomingEvents} />
          <TinderEvents events={featuredEvents} />
        </div>

        {/* RIGHT COLUMN - Recent Activity & AI Recommendations */}
        <div className="space-y-6">
          <RecentActivity activities={recentActivities} />
          <AIRecommendations recommendations={aiRecommendations} />
        </div>
      </div>
    </div>
  );
}
