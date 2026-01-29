'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Users,
  Clock,
  MessageCircle,
  Loader2,
  Filter,
} from 'lucide-react';
import Image from 'next/image';

export default function FindPartnersPage() {
  /* ===================== STATE – GIỮ NGUYÊN ===================== */
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [universityFilter, setUniversityFilter] = useState('all');
  const [majorFilter, setMajorFilter] = useState('all');

  const [partners, setPartners] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ===================== FETCH – GIỮ NGUYÊN ===================== */
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '9',
        });

        if (searchQuery) params.append('search', searchQuery);
        if (subjectFilter !== 'all') params.append('subject', subjectFilter);
        if (ratingFilter !== 'all') params.append('minRating', ratingFilter);
        if (universityFilter !== 'all')
          params.append('university', universityFilter);
        if (majorFilter !== 'all') params.append('major', majorFilter);

        const token = localStorage.getItem('studymate_auth_token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`/api/partners?${params}`, { headers });
        const data = await res.json();

        if (data.success) {
          setPartners(data.data);
          setTotalPages(data.pagination.pages);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchPartners, 300);
    return () => clearTimeout(t);
  }, [
    searchQuery,
    subjectFilter,
    ratingFilter,
    universityFilter,
    majorFilter,
    page,
  ]);

  useEffect(() => {
    fetch('/api/partners/stats')
      .then((r) => r.json())
      .then((d) => d.success && setStats(d.data));
  }, []);

  /* ===================== UI ===================== */
  return (
    <div className="w-full space-y-6">
      {/* ===================== TABS ===================== */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-muted p-1">
          <button className="px-4 py-2 rounded-lg bg-background shadow text-sm font-medium">
            Tìm bạn học
          </button>
          <button className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">
            Yêu cầu kết nối
          </button>
          <button className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">
            Yêu cầu của tôi
          </button>
        </div>
      </div>

      {/* ===================== HEADER ROW ===================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* LEFT */}
        <div>
          <h1 className="text-3xl font-bold">Tìm bạn học</h1>
          <p className="text-muted-foreground">
            Kết nối với những học viên có cùng mục tiêu học tập
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc
          </Button>

          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 rounded-xl"
              placeholder="Tìm kiếm bằng tên, email, ngành, trường"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ===================== GRID ===================== */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((p) => (
            <Card
              key={p._id}
              className="rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <CardHeader className="relative pb-3">
                {p.matchScore && (
                  <Badge className="absolute right-4 top-4 bg-black text-white">
                    {p.matchScore}% Match
                  </Badge>
                )}

                <div className="flex gap-4">
                  <Image
                    src={p.avatar || '/default-avatar.png'}
                    alt={p.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {p.university}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {p.major}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {p.bio}
                </p>

                {p.subjects?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.subjects.slice(0, 2).map((s: string) => (
                      <Badge
                        key={s}
                        className="bg-green-100 text-green-700"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}

                {p.studyStyle?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.studyStyle.slice(0, 2).map((s: string) => (
                      <Badge
                        key={s}
                        className="bg-orange-100 text-orange-700"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {p.studyHours || 0}h
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {p.sessionsCompleted || 0} phiên
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Xem chi tiết
                  </Button>
                  <Button className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Kết nối
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
