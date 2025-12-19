'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserPlus, Loader2, Crown, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';
import { toast } from 'sonner';

export default function GroupMembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembersData = async () => {
      const token = localStorage.getItem('studymate_auth_token');
      if (!token) {
        toast.error('Please login to view group members');
        return;
      }

      try {
        setLoading(true);
        const groupRes = await fetch(`/api/groups/${slug}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const groupData = await groupRes.json();

        if (groupData.success) {
          setGroup(groupData.data);

          const membersRes = await fetch(`/api/groups/${slug}/members`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const membersData = await membersRes.json();

          if (membersData.success) setMembers(membersData.data);
        }
      } catch (error) {
        console.error('Failed to fetch members data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembersData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">Group not found</h2>
        <p className="text-muted-foreground mt-2">The group you're looking for doesn't exist.</p>
        <Link href="/groups">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/groups/${slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Group
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{group.name} - Members</h1>
            <p className="text-sm text-muted-foreground">
              {group.members_count} members
            </p>
          </div>
        </div>
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member: any) => (
              <div key={member._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt={member.fullName || 'Member'}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-medium">
                        {(member.fullName || 'Anonymous').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{member.fullName || 'Anonymous'}</h3>
                      {group.creatorId?.toString() === member._id?.toString() && (
                        <Badge variant="default" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Creator
                        </Badge>
                      )}
                      {group.admins?.includes(member._id) && group.creatorId?.toString() !== member._id?.toString() && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Joined {format(new Date(member.joinedAt || Date.now()), 'PP')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {member.reputation || 0} reputation
                  </p>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No members yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}