const mongoose = require('mongoose');
const Group = require('./models/Group').default;

const seedGroups = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studymate');

    // Clear existing groups
    await Group.deleteMany({});

    const sampleGroups = [
      {
        name: 'Nhóm Thuật toán Nâng cao',
        slug: 'thuật-toán-nâng-cao',
        description: 'Nhóm học tập dành cho những bạn yêu thích thuật toán và cấu trúc dữ liệu. Chúng ta sẽ cùng nhau giải quyết các bài toán khó và chuẩn bị cho các kỳ thi lập trình.',
        category: 'Khoa học máy tính',
        isPublic: true,
        creatorId: new mongoose.Types.ObjectId(), 
        creatorName: 'Nguyễn Văn A',
        members: [],
        admins: [],
        members_count: 1,
        avatar: '/default-avatar.png',
        coverImage: '/default-cover.jpg',
        status: 'active',
      },
      {
        name: 'Tiếng Anh Giao Tiếp',
        slug: 'tiếng-anh-giao-tiếp',
        description: 'Nhóm luyện tập tiếng Anh giao tiếp hàng ngày. Mỗi tuần chúng ta sẽ có các buổi practice speaking và listening.',
        category: 'Ngoại ngữ',
        isPublic: true,
        creatorId: new mongoose.Types.ObjectId(), 
        creatorName: 'Trần Thị B',
        members: [],
        admins: [],
        members_count: 1,
        avatar: '/default-avatar.png',
        coverImage: '/default-cover.jpg',
        status: 'active',
      },
      {
        name: 'Ôn Thi Đại Học Toán',
        slug: 'on-thi-dai-hoc-toan',
        description: 'Nhóm ôn tập môn Toán cho kỳ thi đại học. Chúng ta sẽ tập trung vào các dạng bài tập thường gặp và kỹ năng làm bài.',
        category: 'Ôn thi THPT',
        isPublic: true,
        creatorId: new mongoose.Types.ObjectId(), 
        creatorName: 'Lê Văn C',
        members: [],
        admins: [],
        members_count: 1,
        avatar: '/default-avatar.png',
        coverImage: '/default-cover.jpg',
        status: 'active',
      },
      {
        name: 'Lập Trình Web Fullstack',
        slug: 'lap-trinh-web-fullstack',
        description: 'Nhóm học lập trình web từ cơ bản đến nâng cao. Bao gồm HTML, CSS, JavaScript, React, Node.js và MongoDB.',
        category: 'Khoa học máy tính',
        isPublic: true,
        creatorId: new mongoose.Types.ObjectId(), 
        creatorName: 'Phạm Thị D',
        members: [],
        admins: [],
        members_count: 1,
        avatar: '/default-avatar.png',
        coverImage: '/default-cover.jpg',
        status: 'active',
      },
      {
        name: 'Marketing Digital 2024',
        slug: 'marketing-digital-2024',
        description: 'Nhóm học marketing digital hiện đại. Bao gồm SEO, SEM, Social Media Marketing và Content Marketing.',
        category: 'Marketing',
        isPublic: true,
        creatorId: new mongoose.Types.ObjectId(), 
        creatorName: 'Hoàng Văn E',
        members: [],
        admins: [],
        members_count: 1,
        avatar: '/default-avatar.png',
        coverImage: '/default-cover.jpg',
        status: 'active',
      },
    ];

    await Group.insertMany(sampleGroups);
    console.log('Sample groups seeded successfully!');

    // Get all groups to show IDs
    const groups = await Group.find({}, 'name _id slug');
    console.log('Created groups:');
    groups.forEach(group => {
      console.log(`- ${group.name}: ${group._id} (slug: ${group.slug})`);
    });

  } catch (error) {
    console.error('Error seeding groups:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedGroups();