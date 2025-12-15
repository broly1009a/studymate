'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Heart, MessageCircle, Info, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Story {
  id: string
  image: string
  title: string
  description: string
}

interface Partner {
  id: string
  name: string
  avatar: string
  age: number
  major: string
  university: string
  bio: string
  subjects: string[]
  matchScore: number
  stories: Story[]
  hasNewStory: boolean
}

const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Nguyễn Minh Anh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh',
    age: 21,
    major: 'Khoa học Máy tính',
    university: 'ĐH Bách Khoa',
    bio: 'Đam mê lập trình và AI. Thích học nhóm và chia sẻ kiến thức.',
    subjects: ['Python', 'Machine Learning', 'Toán'],
    matchScore: 95,
    hasNewStory: true,
    stories: [
      {
        id: 's1',
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        title: 'Học Python',
        description: 'Đang học về Deep Learning 🤖'
      },
      {
        id: 's2',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
        title: 'Dự án AI',
        description: 'Làm chatbot với GPT 💬'
      },
      {
        id: 's3',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        title: 'Code cùng nhau',
        description: 'Tìm bạn pair programming ✨'
      }
    ]
  },
  {
    id: '2',
    name: 'Trần Hoàng Long',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Long',
    age: 22,
    major: 'Toán học',
    university: 'ĐH Khoa học Tự nhiên',
    bio: 'Yêu thích giải toán và dạy kèm. Sẵn sàng giúp đỡ bạn học.',
    subjects: ['Giải tích', 'Đại số', 'Xác suất'],
    matchScore: 88,
    hasNewStory: true,
    stories: [
      {
        id: 's1',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        title: 'Giải toán',
        description: 'Bài tập Giải tích 2 📐'
      },
      {
        id: 's2',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
        title: 'Học nhóm',
        description: 'Cùng nhau ôn thi 📚'
      }
    ]
  },
  {
    id: '3',
    name: 'Lê Thị Hương',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huong',
    age: 20,
    major: 'Vật lý',
    university: 'ĐH Bách Khoa',
    bio: 'Nghiên cứu vật lý lượng tử. Thích thảo luận và học hỏi.',
    subjects: ['Vật lý', 'Toán', 'Lập trình'],
    matchScore: 92,
    hasNewStory: false,
    stories: [
      {
        id: 's1',
        image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
        title: 'Thí nghiệm',
        description: 'Lab vật lý lượng tử ⚛️'
      },
      {
        id: 's2',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
        title: 'Nghiên cứu',
        description: 'Đọc paper mới 📄'
      },
      {
        id: 's3',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        title: 'Tìm bạn học',
        description: 'Cùng nhau chinh phục vật lý 🚀'
      }
    ]
  },
  {
    id: '4',
    name: 'Phạm Đức Anh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anh',
    age: 23,
    major: 'Kỹ thuật',
    university: 'ĐH Bách Khoa',
    bio: 'Đam mê công nghệ và sáng tạo.',
    subjects: ['Cơ khí', 'Điện tử', 'Lập trình'],
    matchScore: 85,
    hasNewStory: true,
    stories: [
      {
        id: 's1',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
        title: 'Dự án robot',
        description: 'Làm robot tự động 🤖'
      }
    ]
  },
  {
    id: '5',
    name: 'Võ Thị Mai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mai',
    age: 21,
    major: 'Kinh tế',
    university: 'ĐH Kinh tế',
    bio: 'Yêu thích phân tích dữ liệu và kinh doanh.',
    subjects: ['Kinh tế', 'Thống kê', 'Excel'],
    matchScore: 78,
    hasNewStory: false,
    stories: [
      {
        id: 's1',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        title: 'Phân tích dữ liệu',
        description: 'Học Excel nâng cao 📊'
      }
    ]
  }
]

export default function DiscoverPage() {
  const router = useRouter()
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  // Auto progress story
  useEffect(() => {
    if (!selectedPartner || isPaused) return

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextStory()
          return 0
        }
        return prev + 2
      })
    }, 100) // 5 seconds per story

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [currentStoryIndex, selectedPartner, isPaused])

  const handleNextStory = () => {
    if (!selectedPartner) return

    if (currentStoryIndex < selectedPartner.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
      setProgress(0)
    } else {
      // End of stories, close viewer
      handleClose()
    }
  }

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
      setProgress(0)
    }
  }

  const handleStoryClick = (partner: Partner) => {
    setSelectedPartner(partner)
    setCurrentStoryIndex(0)
    setProgress(0)
    setShowInfo(false)
  }

  const handleClose = () => {
    setSelectedPartner(null)
    setCurrentStoryIndex(0)
    setProgress(0)
    setShowInfo(false)
  }

  const handleLike = () => {
    if (!selectedPartner) return
    toast.success(`Đã thích ${selectedPartner.name}! ❤️`)
  }

  const handleMessage = () => {
    if (!selectedPartner) return
    toast.success(`Đang mở chat với ${selectedPartner.name}...`)
    router.push('/messages')
  }

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 2) {
      handlePreviousStory()
    } else {
      handleNextStory()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Khám phá Stories</h1>
            <p className="text-gray-600 text-sm mt-1">Xem stories của bạn học phù hợp</p>
          </div>
          <button
            onClick={() => router.push('/matches')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Quay lại
          </button>
        </div>
      </div>

      {/* Stories Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {/* Add Your Story */}
            <button className="flex-shrink-0 flex flex-col items-center gap-2 group">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center hover:from-gray-300 hover:to-gray-400 transition">
                  <Plus className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">Thêm story</span>
            </button>

            {/* Partner Stories */}
            {mockPartners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => handleStoryClick(partner)}
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                <div className="relative">
                  {/* Story Ring */}
                  <div className={`absolute inset-0 rounded-full ${
                    partner.hasNewStory
                      ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
                      : 'bg-gray-300'
                  } p-[3px]`}>
                    <div className="w-full h-full rounded-full bg-white p-[3px]">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={partner.avatar}
                          alt={partner.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-20 h-20" />
                </div>
                <span className="text-xs text-gray-700 font-medium max-w-[80px] truncate">
                  {partner.name.split(' ').slice(-2).join(' ')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <div className="text-gray-400 mb-4">
          <MessageCircle className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Nhấn vào avatar để xem stories
        </h3>
        <p className="text-gray-500">
          Khám phá những gì bạn học của bạn đang chia sẻ
        </p>
      </div>

      {/* Story Viewer - Full Screen Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Story Container */}
          <div className="relative w-full max-w-md h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl">
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={handleTap}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Background Image */}
              <Image
                src={selectedPartner.stories[currentStoryIndex].image}
                alt={selectedPartner.stories[currentStoryIndex].title}
                fill
                className="object-cover"
                priority
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60" />

              {/* Progress Bars */}
              <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
                {selectedPartner.stories.map((_, index) => (
                  <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100"
                      style={{
                        width: index < currentStoryIndex ? '100%' :
                               index === currentStoryIndex ? `${progress}%` : '0%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-8 left-4 right-4 flex items-center gap-3 z-10 mt-6">
                <div className="relative w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                  <Image
                    src={selectedPartner.avatar}
                    alt={selectedPartner.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{selectedPartner.name}</h3>
                  <p className="text-white/80 text-sm">{selectedPartner.major}</p>
                </div>
              </div>

              {/* Story Content */}
              <div className="absolute bottom-32 left-4 right-4 z-10">
                <h2 className="text-white text-3xl font-bold mb-2">
                  {selectedPartner.stories[currentStoryIndex].title}
                </h2>
                <p className="text-white/90 text-lg">
                  {selectedPartner.stories[currentStoryIndex].description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowInfo(!showInfo)
                  }}
                  className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition"
                >
                  <Info className="w-6 h-6" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike()
                  }}
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 rounded-full hover:scale-110 transition shadow-lg"
                >
                  <Heart className="w-6 h-6 fill-current" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMessage()
                  }}
                  className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition"
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Info Panel */}
            {showInfo && (
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-6 z-20 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white text-2xl font-bold">
                        {selectedPartner.name}, {selectedPartner.age}
                      </h3>
                      <p className="text-white/80">
                        {selectedPartner.major} • {selectedPartner.university}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold">
                      {selectedPartner.matchScore}% phù hợp
                    </div>
                  </div>

                  <p className="text-white/90 mb-4">{selectedPartner.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.subjects.map((subject) => (
                      <span key={subject} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

