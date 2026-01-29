'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Trophy,
  Users,
  Calendar,
  Clock,
  Loader2,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { vi as viLocale } from 'date-fns/locale'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { API_URL } from '@/lib/constants'

export default function CompetitionsPage() {
  /* ===== LOGIC GIỮ NGUYÊN ===== */
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [competitions, setCompetitions] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (subjectFilter !== 'all') params.append('subject', subjectFilter)
        if (statusFilter !== 'all') params.append('status', statusFilter)
        if (difficultyFilter !== 'all') params.append('difficulty', difficultyFilter)

        const [compRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/competitions?${params.toString()}`),
          fetch(`${API_URL}/competitions/stats`),
        ])

        const compData = await compRes.json()
        const statsData = await statsRes.json()

        if (compData.success) setCompetitions(compData.data)
        if (statsData.success) setStats(statsData.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCompetitions()
  }, [searchQuery, subjectFilter, statusFilter, difficultyFilter])

  /* ===== HELPER ===== */
  const statusMap: any = {
    upcoming: { label: 'Sắp diễn ra', color: 'bg-blue-500' },
    ongoing: { label: 'Online', color: 'bg-green-500' },
    completed: { label: 'Offline', color: 'bg-gray-500' },
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20">
      {/* ===== HEADER ===== */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Cuộc thi</h1>
        <p className="text-muted-foreground mt-2">
          Cạnh tranh, học hỏi và giành giải thưởng
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* ===== FEATURED EVENTS ===== */}
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Sự kiện nổi bật</h2>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="rounded-full">‹</Button>
                <Button size="icon" variant="outline" className="rounded-full">›</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {competitions.slice(0, 3).map((c) => (
                <Card
                  key={c._id}
                  className="overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition"
                >
                  <div className="relative h-48">
                    <Image
                      src={c.banner || '/images/default-cover.jpg'}
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-white text-black">
                      {format(new Date(c.startDate), 'dd/MM/yyyy')}
                    </Badge>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    <Badge className={`${statusMap[c.status]?.color} text-white w-fit`}>
                      {statusMap[c.status]?.label}
                    </Badge>

                    <h3 className="font-semibold text-lg line-clamp-2">
                      {c.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>

                    <div className="text-orange-500 font-semibold flex items-center gap-1">
                      🏆 {c.prize}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {c.participantCount}
                      </span>
                    </div>

                    <Button className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500">
                      Đăng ký ngay
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ===== FILTER ===== */}
          <section className="mb-8">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10 rounded-full"
                  placeholder="Tìm kiếm bằng tên, quy mô sự kiện"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="rounded-full w-[180px]">
                  <SelectValue placeholder="Tất cả hình thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-full w-[180px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                  <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                  <SelectItem value="completed">Đã kết thúc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* ===== LIST ===== */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Danh sách sự kiện</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {competitions.map((c) => (
                <Card
                  key={c._id}
                  className="overflow-hidden rounded-2xl hover:shadow-lg transition"
                >
                  <div className="relative h-40">
                    <Image
                      src={c.banner || '/images/default-cover.jpg'}
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <Badge
                      className={`absolute top-3 right-3 ${statusMap[c.status]?.color} text-white`}
                    >
                      {statusMap[c.status]?.label}
                    </Badge>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-2">
                      {c.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {c.participantCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {format(new Date(c.startDate), 'dd/MM/yyyy')}
                      </span>
                    </div>

                    <Button variant="outline" className="w-full rounded-xl">
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
