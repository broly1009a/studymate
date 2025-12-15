'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MoreVertical, Ban, UserCheck, Trash, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const users = [
    {
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      joinedDate: '2025-01-15',
      lastActive: '2025-10-27',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
    {
      id: '2',
      username: 'jane_smith',
      email: 'jane@example.com',
      role: 'moderator',
      status: 'active',
      joinedDate: '2025-02-20',
      lastActive: '2025-10-26',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    },
    {
      id: '3',
      username: 'bob_wilson',
      email: 'bob@example.com',
      role: 'user',
      status: 'suspended',
      joinedDate: '2025-03-10',
      lastActive: '2025-10-20',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    },
  ];

  const handleSuspend = (userId: string) => {
    toast.success('User suspended');
  };

  const handleUnsuspend = (userId: string) => {
    toast.success('User unsuspended');
  };

  const handleDelete = (userId: string) => {
    toast.success('User deleted');
  };

  const handleExport = () => {
    toast.success('User data exported');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-2">← Back to Admin</Button>
          </Link>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage platform users</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                      <Badge
                        variant={user.status === 'active' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-4 hidden md:block">
                    <div className="text-sm text-muted-foreground">Joined</div>
                    <div className="text-sm">{user.joinedDate}</div>
                  </div>
                  {user.status === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuspend(user.id)}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnsuspend(user.id)}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Unsuspend
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

