'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { vi } from '@/lib/i18n/vi';

export default function GroupMembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembersData = async () => {
      try {
        setLoading(true);
        const [groupRes, membersRes] = await Promise.all([
          fetch(`/api/groups/${id}`),
          fetch(`/api/groups/${id}/members`),
        ]);

        const groupData = await groupRes.json();
        const membersData = await membersRes.json();

        if (groupData.success) setGroup(groupData.data);
        if (membersData.success) setMembers(membersData.data);
      } catch (error) {
        console.error('Failed to fetch members data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembersData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group) {
    return <div className="w-full">Không tìm thấy nhóm</div>;
  }

  return (
    <div className="w-full">
      <Link href={`/groups/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Members ({members.length})</CardTitle>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Members
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Image
                      src={member.userAvatar}
                      alt={member.userName}
                      width={64}
                      height={64}
                      className="rounded-full mb-3"
                    />
                    <h3 className="font-medium">{member.userName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {member.reputation} reputation
                    </p>
                    <Badge variant={
                      member.role === 'owner' ? 'default' :
                      member.role === 'admin' ? 'secondary' :
                      'outline'
                    }>
                      {member.role}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

