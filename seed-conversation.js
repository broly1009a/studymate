const mongoose = require('mongoose');
const Conversation = require('../src/models/Conversation');

async function seedConversation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studymate');

    const conversation = new Conversation({
      participants: ['user1', 'user2'],
      participantNames: ['User One', 'User Two'],
      lastMessage: 'Hello!',
      lastMessageTime: new Date(),
      unreadCounts: new Map([['user1', 1], ['user2', 0]]),
      isActive: true,
    });

    await conversation.save();
    console.log('Conversation created with ID:', conversation._id);
    process.exit(0);
  } catch (error) {
    console.error('Error creating conversation:', error);
    process.exit(1);
  }
}

seedConversation();