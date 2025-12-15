'use client';

import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTeamById } from '@/lib/mock-data/competitions';
import { ArrowLeft, Users, UserPlus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const team = getTeamById(id);

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

  const handleJoinTeam = () => {
    toast.success('Join request sent!');
  };

  return (
    <div className="w-full">
      <Link href={`/competitions/${team.competitionId}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Competition
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

          {team.skillsNeeded.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Skills Needed</h3>
              <div className="flex flex-wrap gap-2">
                {team.skillsNeeded.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-3">Team Members</h3>
            <div className="space-y-3">
              {team.members.map((member) => (
                <div key={member.userId} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Image
                    src={member.userAvatar}
                    alt={member.userName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{member.userName}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {team.lookingForMembers && team.memberCount < team.maxMembers && (
            <Button onClick={handleJoinTeam} className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Request to Join Team
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

