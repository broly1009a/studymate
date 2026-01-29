'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Search,
  Users,
  Plus,
  Globe,
  Lock,
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
import {
  Card,
  CardContent,
} from '@/components/ui/card'

import { API_URL } from '@/lib/constants'
import { toast } from 'sonner'

export default function GroupsPage() {
  /* ===== LOGIC GIỮ NGUYÊN ===== */
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [page, setPage] = useState(1)

  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem('studymate_auth_token')
      if (!token) {
        toast.error('Vui lòng đăng nhập')
        return
      }

      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '9',
        })

        if (searchQuery) params.append('search', searchQuery)
        if (categoryFilter !== 'all') params.append('category', categoryFilter)
        if (visibilityFilter !== 'all') params.append('visibility', visibilityFilter)

        const res = await fetch(`${API_URL}/groups?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (data.success) {
          setGroups(data.data)
          setTotalPages(data.pagination.pages)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const t = setTimeout(fetchGroups, 300)
    return () => clearTimeout(t)
  }, [searchQuery, categoryFilter, visibilityFilter, page])

  /* ===== UI ===== */
  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-16">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">Nhóm học</h1>
          <p className="text-muted-foreground mt-1">
            Tham gia nhóm và cùng nhau học tập
          </p>
        </div>

        <Link href="/groups/new">
          <Button className="gap-2 rounded-full">
            <Plus size={18} /> Tạo nhóm +
          </Button>
        </Link>
      </div>

      {/* ===== Tabs (CENTER – PILL STYLE) ===== */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-muted rounded-full p-1">
          <button className="px-6 py-2 rounded-full bg-background shadow text-sm font-medium">
            Tìm nhóm
          </button>
          <button className="px-6 py-2 rounded-full text-sm text-muted-foreground">
            Yêu cầu của tôi
          </button>
        </div>
      </div>

      {/* ===== Filters ===== */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 rounded-full"
            placeholder="Tìm kiếm bằng tên nhóm, ngành học"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
          <SelectTrigger className="rounded-full">
            <SelectValue placeholder="Tất cả nhóm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả nhóm</SelectItem>
            <SelectItem value="public">Công khai</SelectItem>
            <SelectItem value="private">Riêng tư</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="rounded-full">
            <SelectValue placeholder="Tất cả trường học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trường</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="rounded-full">
            <SelectValue placeholder="Tất cả ngành học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả ngành</SelectItem>
            <SelectItem value="Kỹ thuật phần mềm">Kỹ thuật phần mềm</SelectItem>
            <SelectItem value="An toàn thông tin">An toàn thông tin</SelectItem>
            <SelectItem value="Khoa học máy tính">Khoa học máy tính</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ===== Group Cards ===== */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          Đang tải nhóm...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <motion.div
              key={group._id}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 260 }}
            >
              <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition">
                {/* Cover */}
                <div className="relative h-36">
                  <Image
                    src={group.coverImage || '/images/default-cover.jpg'}
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {group.isPublic ? (
                      <Badge className="rounded-full bg-blue-600">
                        <Globe size={12} className="mr-1" />
                        Nhóm công khai
                      </Badge>
                    ) : (
                      <Badge className="rounded-full bg-gray-700">
                        <Lock size={12} className="mr-1" />
                        Nhóm riêng tư
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="pt-10 pb-4">
                  {/* Avatar */}
                  <div className="-mt-16 mb-3">
                    <Image
                      src={group.avatar || '/images/default-avatar.png'}
                      alt=""
                      width={64}
                      height={64}
                      className="rounded-xl border-4 border-white bg-white"
                    />
                  </div>

                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                    {group.name}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {group.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">Kỹ thuật phần mềm</Badge>
                    <Badge variant="secondary">An toàn thông tin</Badge>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users size={14} />
                      {group.memberCount || 36} / 40
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/groups/${group.slug}`}>
                        <Button variant="outline" size="sm" className="rounded-full">
                          Xem chi tiết
                        </Button>
                      </Link>
                      <Button size="sm" className="rounded-full">
                        Tham gia
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-10">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Trước
          </Button>
          <span className="text-sm text-muted-foreground flex items-center">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}
