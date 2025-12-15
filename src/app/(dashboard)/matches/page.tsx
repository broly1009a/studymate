'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Star, Clock, MessageCircle, ChevronDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function FindPartnersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [industryFilter, setIndustryFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [partners, setPartners] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '9',
        });

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        if (subjectFilter !== 'all') {
          params.append('subject', subjectFilter);
        }

        if (ratingFilter !== 'all') {
          params.append('minRating', ratingFilter);
        }

        const response = await fetch(`/api/partners?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setPartners(data.data);
          setTotalPages(data.pagination.pages);
        }
      } catch (error) {
        console.error('Failed to fetch partners:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchPartners, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, subjectFilter, ratingFilter, page]);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/partners/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Khan Academy style categories
  const mainCategories = [
    {
      id: 'economics-management',
      name: 'Khối ngành Kinh tế – Quản trị',
      description: 'Quản trị kinh doanh, Marketing, Tài chính',
      subcategories: [
        { id: 'business-admin', name: 'Quản trị Kinh doanh' },
        { id: 'marketing', name: 'Marketing' },
        { id: 'finance', name: 'Tài chính' },
      ]
    },
    {
      id: 'technology-digital',
      name: 'Khối ngành Công nghệ – Kỹ thuật số',
      description: 'Kỹ thuật phần mềm, AI, Khoa học dữ liệu',
      subcategories: [
        { id: 'software-engineering', name: 'Kỹ thuật Phần mềm' },
        { id: 'artificial-intelligence', name: 'Trí tuệ Nhân tạo' },
        { id: 'data-science', name: 'Khoa học Dữ liệu' },
      ]
    },
    {
      id: 'languages-social-media',
      name: 'Khối ngành Ngôn ngữ – Xã hội – Truyền thông',
      description: 'Tiếng Anh, Truyền thông đa phương tiện',
      subcategories: [
        { id: 'english-language', name: 'Ngôn ngữ Anh' },
        { id: 'multimedia-communications', name: 'Truyền thông đa phương tiện' },
      ]
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tìm bạn học</h1>
        <p className="text-muted-foreground mt-2">Kết nối với những học viên có cùng mục tiêu học tập</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số bạn học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPartners || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats?.activePartners || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đánh giá TB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || 0} ⭐</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Phiên học của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedSessions || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Khan Academy Style Category Navigation */}
      <div className="mb-6 relative z-[60] overflow-visible">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
            isDropdownOpen
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-border hover:bg-muted'
          }`}
          aria-expanded={isDropdownOpen}
        >
          <span>Danh mục</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Overlay */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-border rounded-lg shadow-lg z-[60] overflow-visible">
            <div className="p-4 overflow-visible">
              <p className="text-sm text-muted-foreground mb-4">
                Chọn danh mục để xem các chuyên ngành bên trong
              </p>
              <div className="space-y-1 overflow-visible">
                {mainCategories.map((category) => (
                  <div
                    key={category.id}
                    className="relative group"
                    onMouseEnter={() => {
                      // Cancel any pending timeout when entering a category
                      if (categoryTimeoutRef.current) {
                        clearTimeout(categoryTimeoutRef.current);
                        categoryTimeoutRef.current = null;
                      }
                      setActiveCategory(category.id);
                    }}
                    onMouseLeave={() => {
                      // Set a timeout to hide the category, but allow it to be cancelled
                      categoryTimeoutRef.current = setTimeout(() => {
                        setActiveCategory(null);
                        categoryTimeoutRef.current = null;
                      }, 100);
                    }}
                  >
                    <button
                      onClick={() => {
                        // Handle category selection
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-3 rounded-md hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </button>

                    {/* Subcategories Panel on Hover */}
                    {activeCategory === category.id && (
                      <div
                      className="absolute left-full top-0 ml-2 w-64 bg-white border border-border rounded-lg shadow-xl overflow-hidden z-[70] transition-all duration-200 ease-in-out"
                    >
                        <div className="p-4">
                          <h4 className="font-semibold mb-3">{category.name}</h4>
                          <div className="space-y-1">
                            {category.subcategories.map((subcategory) => (
                              <button
                                key={subcategory.id}
                                onClick={() => {
                                  // Handle subcategory selection
                                  setIsDropdownOpen(false);
                                  setActiveCategory(null);
                                }}
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm cursor-pointer"
                              >
                                {subcategory.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Partners Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {partners.map((partner) => (
              <Link key={partner._id} href={`/matches/${partner._id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={partner.avatar || '/default-avatar.png'}
                          alt={partner.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover w-full h-full"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(partner.status)}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{partner.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{partner.rating || 0}</span>
                            <span className="text-muted-foreground">({partner.reviewsCount || 0})</span>
                          </div>
                        </div>
                        {partner.matchScore && (
                          <Badge className="mt-2 bg-blue-500/10 text-blue-500">
                            {partner.matchScore}% Match
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{partner.bio}</p>

                    {/* Subjects */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Môn học</div>
                      <div className="flex flex-wrap gap-1">
                        {(partner.subjects || []).slice(0, 3).map((subject: string) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Giờ học</div>
                          <div className="font-medium">{partner.studyHours || 0}h</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Phiên học</div>
                          <div className="font-medium">{partner.sessionsCompleted || 0}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Gửi yêu cầu
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-6">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Trước
              </Button>
              <div className="text-sm text-muted-foreground">
                Trang {page} của {totalPages}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && partners.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy bạn học</h3>
            <p className="text-muted-foreground mb-4">
              Thử điều chỉnh bộ lọc tìm kiếm
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSubjectFilter('all');
              setRatingFilter('all');
              setIsDropdownOpen(false);
              setActiveCategory(null);
              setPage(1);
            }}>
              Xóa bộ lọc
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
