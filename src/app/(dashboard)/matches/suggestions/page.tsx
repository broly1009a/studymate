'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, X, Info, MessageCircle, Star, BookOpen, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Partner {
  _id: string;
  userId: string;
  name: string;
  avatar: string;
  age: number;
  major: string;
  university: string;
  bio: string;
  subjects: string[];
  rating: number;
  matchScore: number;
  studyHours: number;
  sessionsCompleted: number;
  badges: string[];
}

export default function MatchSuggestionsPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [suggestions, setSuggestions] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners?minMatchScore=70&limit=10');
        if (!response.ok) {
          throw new Error('Failed to fetch partners');
        }
        const data = await response.json();
        setSuggestions(data.data || []);
      } catch (error: any) {
        toast.error('Không thể tải danh sách đối tác');
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const currentPartner = suggestions[currentIndex];

  const handleNext = () => {
    if (currentIndex < suggestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowInfo(false);
    } else {
      toast.success('Đã xem hết tất cả gợi ý!');
      router.push('/matches');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowInfo(false);
    }
  };

  const handleLike = () => {
    toast.success(`Đã gửi yêu cầu kết nối đến ${currentPartner.name}! ❤️`);
    handleNext();
  };

  const handleSkip = () => {
    toast.info(`Đã bỏ qua ${currentPartner.name}`);
    handleNext();
  };

  const handleMessage = () => {
    toast.success(`Đang mở chat với ${currentPartner.name}...`);
    router.push('/messages');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <p>Đang tải danh sách đối tác...</p>
        </div>
      </div>
    );
  }

  if (!currentPartner) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <button
          onClick={() => router.push('/matches')}
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 p-2 rounded-full transition"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-white text-center">
          <p className="text-lg mb-4">Không tìm thấy đối tác phù hợp</p>
          <button
            onClick={() => router.push('/matches')}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-full hover:scale-105 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <button
        onClick={() => router.push('/matches')}
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 p-2 rounded-full transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex items-center justify-center h-full gap-8 px-8">
        <div className="hidden lg:flex flex-col gap-4 w-32">
          {suggestions.slice(Math.max(0, currentIndex - 2), currentIndex).map((partner) => (
            <button
              key={partner.id}
              onClick={() => setCurrentIndex(suggestions.indexOf(partner))}
              className="relative w-full aspect-[3/4] rounded-lg overflow-hidden opacity-50 hover:opacity-75 transition"
            >
              <Image src={partner.avatar} alt={partner.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium truncate">{partner.name}</p>
                <p className="text-white/80 text-xs">{partner.matchScore}%</p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div className="relative w-full max-w-md h-[85vh] bg-black rounded-2xl overflow-hidden shadow-2xl">
          <Image src={currentPartner.avatar} alt={currentPartner.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

          <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
            {suggestions.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-300" style={{ width: index <= currentIndex ? '100%' : '0%' }} />
              </div>
            ))}
          </div>

          <div className="absolute top-8 left-4 right-4 z-10 mt-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                <Image src={currentPartner.avatar} alt={currentPartner.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{currentPartner.name}, {currentPartner.age}</h3>
                <p className="text-white/80 text-sm">{currentPartner.major}</p>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {currentPartner.matchScore}% phù hợp
              </div>
            </div>
          </div>

          <div className="absolute bottom-32 left-4 right-4 z-10">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-semibold">{currentPartner.rating}</span>
              <span className="text-white/80 text-sm">• {currentPartner.studyHours}h học</span>
            </div>
            <p className="text-white/90 text-lg mb-4">{currentPartner.bio}</p>
            <div className="flex flex-wrap gap-2">
              {currentPartner.subjects.slice(0, 4).map((subject) => (
                <span key={subject} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">{subject}</span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-10">
            <button onClick={handleSkip} className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition">
              <X className="w-6 h-6" />
            </button>
            <button onClick={() => setShowInfo(!showInfo)} className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition">
              <Info className="w-6 h-6" />
            </button>
            <button onClick={handleLike} className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 rounded-full hover:scale-110 transition shadow-lg">
              <Heart className="w-6 h-6 fill-current" />
            </button>
            <button onClick={handleMessage} className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition">
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>

          {showInfo && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-6 z-20 animate-slide-up">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Thông tin chi tiết</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <BookOpen className="w-4 h-4" />
                      <span>{currentPartner.university}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="w-4 h-4" />
                      <span>{currentPartner.studyHours} giờ học • {currentPartner.sessionsCompleted} phiên</span>
                    </div>
                  </div>
                </div>
                {currentPartner.badges && currentPartner.badges.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Huy hiệu</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPartner.badges.map((badge) => (
                        <span key={badge} className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">{badge}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="text-white font-semibold mb-2">Môn học</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPartner.subjects.map((subject) => (
                      <span key={subject} className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">{subject}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === suggestions.length - 1}
          className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        <div className="hidden lg:flex flex-col gap-4 w-32">
          {suggestions.slice(currentIndex + 1, currentIndex + 3).map((partner) => (
            <button
              key={partner.id}
              onClick={() => setCurrentIndex(suggestions.indexOf(partner))}
              className="relative w-full aspect-[3/4] rounded-lg overflow-hidden opacity-50 hover:opacity-75 transition"
            >
              <Image src={partner.avatar} alt={partner.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium truncate">{partner.name}</p>
                <p className="text-white/80 text-xs">{partner.matchScore}%</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-40">
        <button onClick={handlePrevious} disabled={currentIndex === 0} className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full disabled:opacity-30">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={handleNext} disabled={currentIndex === suggestions.length - 1} className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full disabled:opacity-30">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
