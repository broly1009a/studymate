'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Plus,
  MessageSquare,
  Eye,
  TrendingUp,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
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
import { Card, CardContent } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { vi as viLocale } from 'date-fns/locale'
import { toast } from 'sonner'
import { API_URL } from '@/lib/constants'

/* ===== TYPES (GIỮ NGUYÊN) ===== */
interface Question {
  _id: string
  title: string
  content: string
  subject: string
  tags: string[]
  votes: number
  answersCount: number
  views: number
  hasAcceptedAnswer: boolean
  createdAt: string
  authorName?: string
  authorAvatar?: string
  authorReputation?: number
}

interface PopularTag {
  tag: string
  count: number
}

export default function ForumPage() {
  /* ===== LOGIC GIỮ NGUYÊN ===== */
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [questions, setQuestions] = useState<Question[]>([])
  const [popularTags, setPopularTags] = useState<PopularTag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()

        if (subjectFilter !== 'all') params.append('subject', subjectFilter)
        if (statusFilter !== 'all') params.append('status', statusFilter)
        if (searchQuery) params.append('search', searchQuery)

        const [qRes, tagRes] = await Promise.all([
          fetch(`${API_URL}/forum-questions?${params}`),
          fetch(`${API_URL}/forum-questions/popular-tags`),
        ])

        if (qRes.ok) {
          const qData = await qRes.json()
          setQuestions(
            qData.data.map((q: any) => ({
              ...q,
              authorName: q.authorId?.username || 'Anonymous',
              authorAvatar: q.authorId?.avatar || '/default-avatar.png',
              authorReputation: q.authorId?.reputation || 0,
              answersCount: q.answers?.length || 0,
              votes: q.upvotes || 0,
            })),
          )
        }

        if (tagRes.ok) {
          const tData = await tagRes.json()
          setPopularTags(tData.data || [])
        }
      } catch {
        toast.error('Không thể tải diễn đàn')
      } finally {
        setLoading(false)
      }
    }

    const t = setTimeout(fetchData, 300)
    return () => clearTimeout(t)
  }, [searchQuery, subjectFilter, statusFilter])

  /* ===== UI ===== */
  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 bg-gradient-to-b from-white to-purple-50/40">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Diễn đàn hỏi đáp</h1>
          <p className="text-muted-foreground mt-1">
            Đặt câu hỏi và chia sẻ kiến thức
          </p>
        </div>
        <Link href="/forum/ask">
          <Button className="rounded-full gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition">
  <Plus size={18} /> Đặt câu hỏi
</Button>

        </Link>
      </div>

      {/* ===== Search + Filters ===== */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-11 rounded-full"
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="rounded-full w-[200px]">
            <SelectValue placeholder="Tất cả trường học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trường học</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="rounded-full w-[200px]">
            <SelectValue placeholder="Tất cả ngành học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả ngành học</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ===== Main ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
        {/* ===== Question List ===== */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-10 w-10 mx-auto animate-spin text-muted-foreground" />
            </div>
          ) : (
            questions.map((q) => (
              <Link key={q._id} href={`/forum/${q._id}`}>
                <Card className="rounded-2xl shadow-sm hover:shadow-md transition bg-white">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Image
                        src={q.authorAvatar!}
                        alt=""
                        width={48}
                        height={48}
                        className="rounded-full"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between gap-2">
                          <h3 className="font-semibold text-lg leading-snug">
                            {q.title}
                          </h3>
                          {q.hasAcceptedAnswer && (
                            <CheckCircle2 className="text-green-500" />
                          )}
                        </div>

                        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                          {q.content}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                          <span className="font-medium text-foreground">
                            {q.authorName}
                          </span>
                          <span>{q.authorReputation} uy tín</span>
                          <span>
                            {formatDistanceToNow(new Date(q.createdAt), {
                              addSuffix: true,
                              locale: viLocale,
                            })}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="rounded-full bg-purple-100 text-purple-700">
                              {q.subject}
                            </Badge>
                            {q.tags.slice(0, 2).map((t) => (
                              <Badge
                                key={t}
                                variant="outline"
                                className="rounded-full"
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <TrendingUp size={14} /> {q.votes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={14} /> {q.answersCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={14} /> {q.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* ===== Sidebar ===== */}
        <div className="space-y-6">
          <Card className="rounded-2xl bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Thẻ phổ biến</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((t) => (
                  <Badge
                    key={t.tag}
                    variant="outline"
                    className="rounded-full cursor-pointer"
                  >
                    #{t.tag} ({t.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
