import mongoose from 'mongoose';
import { connectDB } from '../lib/mongodb';
import Activity from '../models/Activity';

async function seedActivities() {
  try {
    await connectDB();

    const activities = [
      {
        userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        type: 'study_session',
        title: 'Hoàn thành buổi học',
        description: 'Đã học Giải tích trong 2 giờ',
        timestamp: new Date(),
        metadata: { subject: 'Calculus', duration: 120 },
      },
      {
        userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        type: 'question_answered',
        title: 'Đã trả lời câu hỏi',
        description: 'Đã giúp đỡ với bài toán Đại số tuyến tính',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        metadata: { questionId: 'q123', subject: 'Linear Algebra' },
      },
      {
        userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        type: 'badge_earned',
        title: 'Đạt được huy hiệu',
        description: 'Mở khóa huy hiệu "Chuỗi 100 ngày"',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        metadata: { badgeId: '1', badgeName: '100 Day Streak' },
      },
    ];

    await Activity.insertMany(activities);
    console.log('Activities seeded successfully');
  } catch (error) {
    console.error('Error seeding activities:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedActivities();