import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'date'; // date, popularity, trending
    const type = searchParams.get('type'); // competition, workshop, seminar

    // Mock featured events data (in production, fetch from database)
    const featuredEvents = [
      {
        id: '1',
        title: 'Cuộc thi Lập trình ACM ICPC 2025',
        description: 'Cuộc thi lập trình quốc tế dành cho sinh viên. Thử thách bản thân với các bài toán khó.',
        type: 'competition',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        time: '09:00 - 17:00',
        location: 'HCMUT',
        participants: 245,
        maxParticipants: 300,
        image: '/cuocthi.jpg',
        organizer: 'ACM ICPC Vietnam',
        tags: ['Lập trình', 'Thuật toán', 'Quốc tế'],
        trending: true,
        featured: true,
        category: 'programming',
      },
      {
        id: '2',
        title: 'Hackathon AI & Machine Learning',
        description: 'Xây dựng giải pháp AI cho bài toán thực tế. Hợp tác với các kỹ sư từ Google.',
        type: 'competition',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        time: '08:00 - 20:00',
        location: 'Online',
        participants: 180,
        maxParticipants: 200,
        image: '/cuocthi.jpg',
        organizer: 'Google Developer Vietnam',
        tags: ['AI', 'Machine Learning', 'Hackathon'],
        trending: true,
        featured: true,
        category: 'ai',
      },
      {
        id: '3',
        title: 'Cuộc thi Thiết kế UI/UX 2025',
        description: 'Thi thiết kế giao diện người dùng sáng tạo. Thể hiện kỹ năng thiết kế của bạn.',
        type: 'competition',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
        time: '10:00 - 18:00',
        location: 'UIT',
        participants: 120,
        maxParticipants: 150,
        image: '/cuocthi.jpg',
        organizer: 'Design Club UIT',
        tags: ['UI/UX', 'Design', 'Creative'],
        trending: false,
        featured: true,
        category: 'design',
      },
      {
        id: '4',
        title: 'Web Development Workshop',
        description: 'Học các kỹ năng web development hiện đại: React, Node.js, và MongoDB.',
        type: 'workshop',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        time: '14:00 - 17:00',
        location: 'Online',
        participants: 85,
        maxParticipants: 100,
        image: '/workshop.jpg',
        organizer: 'Tech Academy Vietnam',
        tags: ['Web', 'React', 'Node.js'],
        trending: true,
        featured: false,
        category: 'web',
      },
      {
        id: '5',
        title: 'Data Science Seminar',
        description: 'Tìm hiểu về ứng dụng Data Science trong các công ty FPT, Viettel, Samsung.',
        type: 'seminar',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        time: '18:00 - 20:00',
        location: 'FPT Building',
        participants: 200,
        maxParticipants: 300,
        image: '/seminar.jpg',
        organizer: 'FPT University',
        tags: ['Data Science', 'Career', 'Internship'],
        trending: false,
        featured: false,
        category: 'data',
      },
      {
        id: '6',
        title: 'Flutter Mobile App Development',
        description: 'Phát triển ứng dụng mobile cross-platform với Flutter.',
        type: 'workshop',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        time: '09:00 - 12:00',
        location: 'Online',
        participants: 60,
        maxParticipants: 80,
        image: '/flutter.jpg',
        organizer: 'Mobile Dev Community',
        tags: ['Flutter', 'Mobile', 'Dart'],
        trending: true,
        featured: false,
        category: 'mobile',
      },
    ];

    let filtered = [...featuredEvents];

    // Filter by type
    if (type) {
      filtered = filtered.filter(e => e.type === type);
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => b.participants - a.participants);
    } else if (sortBy === 'trending') {
      filtered = filtered.filter(e => e.trending).sort((a, b) => b.participants - a.participants);
    }

    // Limit
    filtered = filtered.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error: any) {
    console.error('Error fetching featured events:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch featured events', error: error.message },
      { status: 500 }
    );
  }
}
