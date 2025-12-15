'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPartners } from '@/lib/mock-data/partners';
import { MessageCircle, Star, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { vi } from '@/lib/i18n/vi';

export default function MyPartnersPage() {
  // In a real app, this would filter for accepted partners only
  const partners = getPartners().slice(0, 3);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{vi.matches.myPartners.title}</h1>
        <p className="text-muted-foreground mt-2">{vi.matches.myPartners.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Partners List */}
      <div className="space-y-4">
        {partners.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Study Partners Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start connecting with other students to build your study network
              </p>
              <Link href="/matches">
                <Button>Find Study Partners</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          partners.map((partner) => (
            <Card key={partner.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Link href={`/matches/${partner.id}`}>
                    <Image
                      src={partner.avatar}
                      alt={partner.name}
                      width={80}
                      height={80}
                      className="rounded-full hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/matches/${partner.id}`}>
                          <CardTitle className="text-xl hover:underline">
                            {partner.name}
                          </CardTitle>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{partner.rating}</span>
                          </div>
                          <span className="text-muted-foreground text-sm">
                            • {partner.sessionsCompleted} sessions together
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/matches/sessions?partner=${partner.id}`}>
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                          </Button>
                        </Link>
                        <Link href="/messages">
                          <Button size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">{partner.bio}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Subjects */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Shared Subjects</div>
                    <div className="flex flex-wrap gap-1">
                      {partner.subjects.slice(0, 2).map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Study Style */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Study Style</div>
                    <div className="flex flex-wrap gap-1">
                      {partner.studyStyle.slice(0, 2).map((style) => (
                        <Badge key={style} variant="outline" className="text-xs">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Next Available</div>
                    <div className="text-sm font-medium">
                      {partner.availability[0]}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

