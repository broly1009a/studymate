'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface TeamMember {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'leader' | 'member';
  joinedAt: Date;
}

interface Team {
  _id: string;
  competitionId: {
    _id: string;
    title: string;
  };
  name: string;
  description: string;
  members: TeamMember[];
  memberCount: number;
  maxMembers: number;
  lookingForMembers: boolean;
  skillsNeeded: string[];
}

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teams/${id}`);
      const data = await response.json();

      if (data.success) {
        setTeam(data.data);
      } else {
        toast.error(data.message || 'Failed to load team');
      }
    } catch (error) {
      console.error('Error fetching team:', error);
      toast.error('Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!user) {
      toast.error('Please login to join team');
      return;
    }

    if (!team) return;

    try {
      setJoining(true);
      const response = await fetch(`/api/teams/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.fullName || user.email,
          userAvatar: user.avatar,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully joined the team!');
        fetchTeam(); // Refresh team data
      } else {
        toast.error(data.message || 'Failed to join team');
      }
    } catch (error) {
      console.error('Error joining team:', error);
      toast.error('Failed to join team');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Team Not Found</h1>
          <Link href="/competitions">
            <Button>Back to Competitions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isUserInTeam = team.members.some(member => member.userId === user?.id);
  const canJoinTeam = !isUserInTeam && team.lookingForMembers && team.memberCount < team.maxMembers;

  return (
    <div className="w-full">
      <Link href={`/competitions/${team.competitionId._id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {team.competitionId.title || 'Competition'}
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{team.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{team.memberCount}/{team.maxMembers} members</span>
              </div>
            </div>
            {team.lookingForMembers && (
              <Badge variant="secondary">Looking for members</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{team.description}</p>
          </div>

          {team.skillsNeeded && team.skillsNeeded.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Skills Needed</h3>
              <div className="flex flex-wrap gap-2">
                {team.skillsNeeded.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-3">Team Members</h3>
            <div className="space-y-3">
              {team.members.map((member) => (
                <div key={member.userId} className="flex items-center gap-3 p-3 border rounded-lg">
                  {member.userAvatar ? (
                    <Image
                      src={member.userAvatar}
                      alt={member.userName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {member.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{member.userName}</div>
                    <div className="text-sm text-muted-foreground capitalize">{member.role}</div>
                  </div>
                  {member.role === 'leader' && (
                    <Badge variant="default">Leader</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {canJoinTeam && user && (
            <Button onClick={handleJoinTeam} className="w-full" disabled={joining}>
              {joining ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Request to Join Team
                </>
              )}
            </Button>
          )}

          {isUserInTeam && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
              <p className="text-sm font-medium">You are a member of this team</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

