import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'date'; // date, popularity, trending
    const type = searchParams.get('type'); // competition, workshop, seminar

    // Build query
    let query: any = {
      date: { $gte: new Date() }, // Only upcoming events
    };

    if (type) {
      query.type = type;
    }

    // Fetch from database
    let events = await Event.find(query)
      .select('title description type date time location participants participantCount maxParticipants image organizer tags featured category')
      .lean();

    // Sort
    if (sortBy === 'date') {
      events.sort((a, b) => {
        const dateA: number = new Date(a.date).getTime();
        const dateB: number = new Date(b.date).getTime();
        return dateA - dateB;
      });
    } else if (sortBy === 'popularity') {
      events.sort((a, b) => {
        const participantsA: number = a.participantCount || 0;
        const participantsB: number = b.participantCount || 0;
        return participantsB - participantsA;
      });
    } else if (sortBy === 'trending') {
      // For trending, sort by participantCount (most popular first)
      events.sort((a, b) => {
        const participantsA: number = a.participantCount || 0;
        const participantsB: number = b.participantCount || 0;
        return participantsB - participantsA;
      });
    }

    // Limit
    events = events.slice(0, limit);

    // Format response
    const formattedEvents = events.map((e: any) => ({
      id: e._id,
      title: e.title,
      description: e.description,
      type: e.type,
      date: e.date,
      time: e.time || 'TBD',
      location: e.location || 'Online',
      participants: e.participantCount || 0,
      maxParticipants: e.maxParticipants || 100,
      image: e.image || '/event-default.jpg',
      organizer: e.organizer || 'StudyMate',
      tags: (e.tags as string[]) || [],
      featured: e.featured || false,
      category: e.category || 'general',
    }));

    return NextResponse.json({
      success: true,
      data: formattedEvents,
      total: formattedEvents.length,
    });
  } catch (error: any) {
    console.error('Error fetching featured events:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch featured events', error: error.message },
      { status: 500 }
    );
  }
}
