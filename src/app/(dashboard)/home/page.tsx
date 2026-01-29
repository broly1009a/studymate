'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, Heart, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { motion, AnimatePresence } from 'framer-motion'

import {
  fadeUp,
  fadeIn,
  staggerContainer,
  cardHover,
  buttonTap,
  pulse
} from '@/lib/animations/motion'

/* ================= MOCK DATA ================= */
const hours = Array.from({ length: 13 }, (_, i) => i + 7)

const weekDays = [
  { label: 'Thứ 2', day: 21, date: '2025-11-21' },
  { label: 'Thứ 3', day: 22, date: '2025-11-22' },
  { label: 'Thứ 4', day: 23, date: '2025-11-23' },
  { label: 'Thứ 5', day: 24, date: '2025-11-24', isToday: true },
  { label: 'Thứ 6', day: 25, date: '2025-11-25' },
  { label: 'Thứ 7', day: 26, date: '2025-11-26' },
  { label: 'CN', day: 27, date: '2025-11-27' },
]

/* ================= TODAY SCHEDULE DATA ================= */
const todaySchedules = [
  {
    id: 's1',
    title: 'Phiên học Marketing 12 dành cho người mới',
    date: '2025-11-24',
    startTime: '07:00',
    endTime: '10:00',
    participants: 36,
    color: 'yellow',
  },
  {
    id: 's2',
    title: 'Phiên học Marketing 12',
    date: '2025-11-24',
    startTime: '10:30',
    endTime: '12:30',
    participants: 36,
    color: 'green',
  },
  {
    id: 's3',
    title: 'Phiên học Marketing 12',
    date: '2025-11-24',
    startTime: '12:30',
    endTime: '13:30',
    color: 'red',
  },
]

const events = [
  {
    id: 1,
    title: 'Cuộc thi Lập trình ACM ICPC 2025',
    date: '24/12/2025',
    time: '07:00 – 10:00',
    status: 'ongoing',
    desc: 'Cuộc thi lập trình quốc tế dành cho sinh viên.',
    tags: ['Lập trình', 'Thuật toán', 'Thi đấu'],
  },
  {
    id: 2,
    title: 'Workshop React & Next.js',
    date: '25/12/2025',
    time: '13:30 – 16:30',
    status: 'upcoming',
    desc: 'Nâng cao kỹ năng Frontend hiện đại.',
    tags: ['Frontend', 'React'],
  },
  {
    id: 3,
    title: 'UI/UX Design Bootcamp',
    date: '26/12/2025',
    time: '08:00 – 11:00',
    status: 'finished',
    desc: 'Thiết kế sản phẩm thực tế.',
    tags: ['UI/UX', 'Design'],
  },
]


export default function HomePage() {
  const { isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [lineIndex, setLineIndex] = useState(0)

  // GIỮ NGUYÊN LOGIC CŨ
  const [eventIndex, setEventIndex] = useState(0)

  const lines = [
    'Kết nối bạn học phù hợp',
    'Học nhóm – Thi đấu – Phát triển'
  ]

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % lines.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-[#6059f7]" />
      </div>
    )
  }

  const prevEvent =
    events[(eventIndex - 1 + events.length) % events.length]
  const currentEvent = events[eventIndex]
  const nextEvent =
    events[(eventIndex + 1) % events.length]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-24">
        <motion.div
          className="max-w-6xl mx-auto text-center px-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            variants={fadeUp}
          >
            Bạn Học Chuẩn Gu
          </motion.h1>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-8"
            variants={fadeUp}
          >
            <motion.span
              className="inline-block text-[#6059f7] bg-purple-100 px-4 py-2 rounded-xl"
              variants={pulse}
              animate="animate"
            >
              Học Gì Cũng Dễ
            </motion.span>{' '}
            Cùng STUDYMATE ✨
          </motion.h2>

          <motion.div className="relative h-10 mb-12" variants={fadeIn}>
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIndex}
                className="absolute inset-0 text-lg text-gray-600"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                {lines[lineIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link href="/matches/suggestions">
              <motion.div {...buttonTap}>
                <Button
                  size="lg"
                  className="bg-[#6059f7] hover:bg-[#5048e5] text-white rounded-full px-12 py-6 text-lg"
                >
                  Tìm bạn học ngay <Heart className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-gradient-to-r from-[#6059f7] to-[#7c3aed] py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
          {[
            '70+ Đối tác chiến lược',
            '120.000+ Thành viên',
            '30+ Chuyên gia',
            '60.000+ Lượt học'
          ].map((item) => (
            <div key={item} className="font-bold text-xl md:text-2xl">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ================= EVENTS – CAROUSEL VÒNG TRÒN ================= */}
      <section className="pb-32">
        <h2 className="text-3xl font-bold text-center mb-12">
          Sự Kiện Nổi Bật
        </h2>

        <div className="relative max-w-6xl mx-auto flex items-center justify-center gap-8">

          <Button
            variant="ghost"
            onClick={() =>
              setEventIndex((prev) => (prev - 1 + events.length) % events.length)
            }
          >
            <ChevronLeft />
          </Button>

          <div className="flex items-center gap-8">
            <motion.div
              className="w-[300px]"
              animate={{ scale: 0.9, opacity: 0.5 }}
            >
              <EventCard event={prevEvent} />
            </motion.div>

            <motion.div
              className="w-[360px]"
              animate={{ scale: 1.15, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <EventCard event={currentEvent} isCenter />
            </motion.div>

            <motion.div
              className="w-[300px]"
              animate={{ scale: 0.9, opacity: 0.5 }}
            >
              <EventCard event={nextEvent} />
            </motion.div>
          </div>

          <Button
            variant="ghost"
            onClick={() =>
              setEventIndex((prev) => (prev + 1) % events.length)
            }
          >
            <ChevronRight />
          </Button>
        </div>
      </section>

      {/* ================= TODAY SCHEDULE ================= */}
      
    {/* ================= TODAY SCHEDULE (WEEK VIEW) ================= */}
<section className="max-w-7xl mx-auto px-4 pb-32">
  <div className="flex items-center justify-between mb-6">
  <div className="text-center flex-1">
    <h2 className="text-4xl font-bold mb-2">Lịch Hôm Nay</h2>
    <div className="inline-flex items-center gap-3 text-sm">
      <span className="bg-black text-white px-3 py-1 rounded-full">
        07:12
      </span>
      <span className="text-gray-600">24/11/2025</span>
    </div>
  </div>

  {/* BUTTON XEM CHI TIẾT */}
  <Button
    variant="ghost"
    className="text-[#6059f7] font-semibold flex items-center gap-2"
    onClick={() => {
      console.log('Xem chi tiết lịch ngày 24/11/2025')
    }}
  >
    Xem chi tiết
    <ChevronRight className="w-4 h-4" />
  </Button>
</div>


  <Card className="shadow-xl rounded-2xl overflow-hidden">
    <CardContent className="p-0">
      {/* HEADER DAYS */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b bg-white">
        <div />
        {weekDays.map((day) => (
          <div
            key={day.date}
            className={`p-4 text-center border-l
              ${day.isToday ? 'bg-[#6059f7] text-white' : ''}`}
          >
            <div className="text-xs">
              {day.label}
            </div>
            <div className="font-bold text-lg">
              {day.day}
            </div>
          </div>
        ))}
      </div>

      {/* BODY */}
      <div className="relative grid grid-cols-[80px_repeat(7,1fr)]">
        {/* TIME COLUMN */}
        <div className="border-r bg-gray-50">
          {hours.map(hour => (
            <div
              key={hour}
              className="h-20 text-xs text-gray-400 flex justify-end pr-3 pt-2"
            >
              {hour}:00
            </div>
          ))}
        </div>

        {/* DAY COLUMNS */}
        {weekDays.map(day => (
          <div
            key={day.date}
            className={`relative border-l
              ${day.isToday ? 'bg-purple-50' : ''}`}
          >
            {hours.map((_, i) => (
              <div key={i} className="h-20 border-b" />
            ))}

            {/* EVENTS OF THAT DAY */}
            {todaySchedules
              .filter(e => e.date === day.date)
              .map(e => (
                <ScheduleBlock key={e.id} item={e} />
              ))}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</section>


    </div>
  )
}

/* ================= EVENT CARD ================= */
const STATUS_STYLE: Record<string, string> = {
  upcoming: 'border-l-yellow-400 bg-yellow-50',
  ongoing: 'border-l-green-500 bg-green-50',
  finished: 'border-l-red-400 bg-red-50',
} 
function EventCard({
  event,
  isCenter = false,
}: {
  event: any
  isCenter?: boolean
}) {
  return (
    <Card
      className={`
        relative overflow-hidden rounded-2xl border-l-4 shadow-md transition-all
        ${STATUS_STYLE[event.status]}
        ${isCenter ? 'shadow-xl ring-2 ring-[#6059f7]' : ''}
      `}
    >
      {/* TIME BADGE */}
      <div className="absolute top-4 left-4 z-10">
        <span className="rounded-full bg-black text-white text-xs px-3 py-1">
          {event.time}
        </span>
      </div>

      <CardContent className="pt-14 px-5 pb-5 space-y-3">
        <span className="text-xs text-gray-500">{event.date}</span>

        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs bg-purple-100 text-[#6059f7] px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-semibold text-sm leading-snug">
          {event.title}
        </h3>

        <p className="text-sm text-gray-600">{event.desc}</p>

        <Button
          size="sm"
          className="w-full bg-[#6059f7] hover:bg-[#5048e5] text-white"
        >
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  )
}
function ScheduleBlock({ item }: { item: any }) {
  const startHour = parseInt(item.startTime.split(':')[0])
  const startMin = parseInt(item.startTime.split(':')[1])
  const endHour = parseInt(item.endTime.split(':')[0])
  const endMin = parseInt(item.endTime.split(':')[1])

  const top =
    ((startHour - 7) * 60 + startMin) * (80 / 60)

  const height =
    ((endHour * 60 + endMin) -
      (startHour * 60 + startMin)) *
    (80 / 60)

  const colorMap: Record<string, string> = {
    yellow: 'bg-yellow-100 border-yellow-400',
    green: 'bg-green-100 border-green-400',
    red: 'bg-red-100 border-red-400',
  }

  return (
    <div
      className={`absolute left-3 right-3 rounded-xl border-l-4 p-3 shadow-sm text-sm
        ${colorMap[item.color]}`}
      style={{ top, height }}
    >
      <div className="text-xs bg-black text-white inline-block px-3 py-1 rounded-full mb-2">
        {item.startTime} – {item.endTime}
      </div>

      <div className="font-semibold">{item.title}</div>

      {item.participants && (
        <div className="text-xs text-gray-600 mt-1">
          👥 {item.participants} người tham gia
        </div>
      )}
    </div>
  )
}
