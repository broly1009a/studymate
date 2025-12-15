'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getCompetitionById } from '@/lib/mock-data/competitions';
import { ArrowLeft, Users, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function RegisterCompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const competition = getCompetitionById(id);

  const [registrationType, setRegistrationType] = useState<'solo' | 'team'>('solo');
  const [selectedTeam, setSelectedTeam] = useState('');

  if (!competition) {
    return <div className="w-full">Không tìm thấy cuộc thi</div>;
  }

  const handleRegister = () => {
    toast.success('Đăng ký thành công!');
    router.push(`/competitions/${id}`);
  };

  const availableTeams = [
    { id: '1', name: 'Code Warriors', members: 2, maxMembers: 3 },
    { id: '2', name: 'Algorithm Masters', members: 1, maxMembers: 3 },
  ];

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
            <Button onClick={handleRegister} className="flex-1">
              Complete Registration
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

