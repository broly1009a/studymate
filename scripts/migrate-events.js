// Migration script to add organizerId to existing events
// Run this once to update old events

import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User';

async function migrateEvents() {
  try {
    await connectDB();

    // Find events without organizerId
    const eventsWithoutOrganizerId = await Event.find({
      organizerId: { $exists: false }
    });

    console.log(`Found ${eventsWithoutOrganizerId.length} events to migrate`);

    for (const event of eventsWithoutOrganizerId) {
      // Try to find user by name
      const user = await User.findOne({
        $or: [
          { fullName: event.organizer },
          { username: event.organizer }
        ]
      });

      if (user) {
        event.organizerId = user._id;
        await event.save();
        console.log(`Updated event "${event.title}" with organizerId: ${user._id}`);
      } else {
        console.log(`Could not find user for event "${event.title}" with organizer: ${event.organizer}`);
      }
    }

    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrateEvents();