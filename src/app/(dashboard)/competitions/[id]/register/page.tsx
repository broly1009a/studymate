'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Users, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';
import { API_URL } from '@/lib/constants';
export default function RegisterCompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [competition, setCompetition] = useState<any>(null);
  const [availableTeams, setAvailableTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const [registrationType, setRegistrationType] = useState<'solo' | 'team'>('solo');
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [compRes, teamsRes] = await Promise.all([
          fetch(`${API_URL}/competitions/${id}`),
          fetch(`${API_URL}/teams?forCompetition=true`),
        ]);

        const compData = await compRes.json();
        const teamsData = await teamsRes.json();

        if (compData.success) setCompetition(compData.data);
        if (teamsData.success) setAvailableTeams(teamsData.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load registration data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!competition) {
    return <div className="w-full">Không tìm thấy cuộc thi</div>;
  }

  const handleRegister = async () => {
    try {
      setRegistering(true);
      const response = await fetch(`/api/competitions/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationType,
          teamId: registrationType === 'team' ? selectedTeam : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Đăng ký thành công!');
        router.push(`/competitions/${id}`);
      } else {
        toast.error(data.message || 'Failed to register');
      }
    } catch (error) {
      console.error('Failed to register:', error);
      toast.error('Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="w-full">
      <Link href={`/competitions/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Competition
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Register for {competition.title}</CardTitle>
          <CardDescription>
            Team size: {competition.teamSize.min}-{competition.teamSize.max} members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base">Registration Type</Label>
            <RadioGroup
              value={registrationType}
              onValueChange={(value: any) => setRegistrationType(value)}
              className="mt-3 space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="solo" id="solo" />
                <Label htmlFor="solo" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Register Solo</div>
                      <div className="text-sm text-muted-foreground">
                        You'll be matched with teammates or compete individually
                      </div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="team" id="team" />
                <Label htmlFor="team" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Join Existing Team</div>
                      <div className="text-sm text-muted-foreground">
                        Join a team that's looking for members
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {registrationType === 'team' && (
            <div>
              <Label className="text-base">Select Team</Label>
              <div className="mt-3 space-y-2">
                {availableTeams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`w-full p-4 text-left border rounded-lg transition-colors ${
                      selectedTeam === team.id
                        ? 'border-primary bg-primary/10'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {team.members}/{team.maxMembers} members
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {team.maxMembers - team.members} spots left
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <Link href={`/competitions/${id}/teams/new`}>
                <Button variant="outline" className="w-full mt-3">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create New Team
                </Button>
              </Link>
            </div>
          )}

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Registration Details</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Registration deadline: {new Date(competition.registrationDeadline).toLocaleDateString()}</li>
              <li>• Competition starts: {new Date(competition.startDate).toLocaleDateString()}</li>
              <li>• You can withdraw before the competition starts</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRegister} className="flex-1" disabled={registering}>
              {registering && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Complete Registration
            </Button>
            <Button variant="outline" onClick={() => router.back()} disabled={registering}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

