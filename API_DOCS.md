# StudyMate API Documentation

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# Add bcryptjs for password hashing
npm install bcryptjs
```

2. Setup environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local and add your MongoDB URI and other config
```

3. Run development server:
```bash
npm run dev
# JSON Server for mock data (optional)
npm run json-server
```

## API Routes

### Posts
- `GET /api/posts` - Get all posts with pagination
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get single post (increments views)
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/posts/[id]/like` - Like/Unlike post

### Users
- `GET /api/users` - Get all users with pagination
- `POST /api/users` - Register new user
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update user profile
- `DELETE /api/users/[id]` - Delete user
- `POST /api/users/[id]/follow` - Follow/Unfollow user

### Comments
- `GET /api/comments?postId=...` - Get comments for a post
- `POST /api/comments` - Create new comment
- `GET /api/comments/[id]` - Get single comment
- `PUT /api/comments/[id]` - Update comment
- `DELETE /api/comments/[id]` - Delete comment
- `POST /api/comments/[id]/like` - Like/Unlike comment

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category (admin)

### Conversations
- `GET /api/conversations?userId=...` - Get all conversations for user
- `POST /api/conversations` - Create or get conversation
- `GET /api/conversations/[id]` - Get single conversation
- `PUT /api/conversations/[id]` - Update conversation
- `DELETE /api/conversations/[id]` - Delete conversation
- `PUT /api/conversations/[id]/mark-read` - Mark all messages as read

### Messages
- `GET /api/messages?conversationId=...` - Get messages in conversation
- `POST /api/messages` - Send new message
- `GET /api/messages/[id]` - Get single message
- `PUT /api/messages/[id]` - Update message
- `DELETE /api/messages/[id]` - Delete message (soft delete)
- `POST /api/messages/[id]/read` - Mark message as read
- `POST /api/messages/[id]/reaction` - Add/Remove emoji reaction

### Study Sessions
- `GET /api/study-sessions` - Get all study sessions with filtering
- `POST /api/study-sessions` - Create new study session
- `GET /api/study-sessions/[id]` - Get single study session
- `PUT /api/study-sessions/[id]` - Update study session
- `DELETE /api/study-sessions/[id]` - Delete study session
- `POST /api/study-sessions/[id]/join` - Join/Leave study session

### Partners
- `GET /api/partners` - Get all study partners with filtering
- `POST /api/partners` - Create partner profile
- `GET /api/partners/[id]` - Get single partner profile
- `PUT /api/partners/[id]` - Update partner profile
- `DELETE /api/partners/[id]` - Delete partner profile

### Partner Requests
- `GET /api/partner-requests` - Get partner requests (sent/received)
- `POST /api/partner-requests` - Send partner request
- `GET /api/partner-requests/[id]` - Get single request
- `PUT /api/partner-requests/[id]` - Accept/Reject request
- `DELETE /api/partner-requests/[id]` - Delete request

### Groups
- `GET /api/groups` - Get all groups with filtering
- `POST /api/groups` - Create new group
- `GET /api/groups/[id]` - Get single group
- `PUT /api/groups/[id]` - Update group
- `DELETE /api/groups/[id]` - Delete group
- `POST /api/groups/[id]/members` - Join/Leave group

### Competitions
- `GET /api/competitions` - Get all competitions with filtering
- `POST /api/competitions` - Create new competition
- `GET /api/competitions/[id]` - Get single competition (increments views)
- `PUT /api/competitions/[id]` - Update competition
- `DELETE /api/competitions/[id]` - Delete competition
- `POST /api/competitions/[id]/register` - Register/Unregister participant

## Database Models

### User
- email, password, fullName
- avatar, bio, phone, location
- school, major, verified, role
- subjects, interests, followers, following
- reputation, status, lastLogin

### Post
- title, slug, excerpt, content
- coverImage, authorId, authorName
- category, tags, views, likes
- commentsCount, readTime, status
- featured, publishedAt

### Comment
- postId, authorId, authorName
- content, likes, replies
- parentCommentId, status

### Category
- name, slug, description
- icon, color, postCount

### StudySession
- title, description, creatorId
- subject, topic, goal
- startTime, endTime, duration
- location, online, meetLink
- maxParticipants, participants
- status, notes, resources

### Group
- name, slug, description, avatar
- creatorId, admins, members
- subject, category, isPublic
- resources, status

### Competition
- title, slug, description
- organizerId, category, level
- registrationStartDate, registrationEndDate
- startDate, endDate, location
- participants, winners, status
- resultAnnounced, views

### Partner
- userId, name, avatar, age
- major, university, bio
- subjects, studyHours, rating
- reviewsCount, availability, studyStyle
- goals, timezone, languages
- matchScore, status, badges
- sessionsCompleted, lastActive

### PartnerRequest
- senderId, senderName, senderAvatar
- receiverId, receiverName, receiverAvatar
- subject, message, status

### Conversation
- participants, participantNames
- lastMessage, lastMessageTime
- unreadCounts (map), subject
- isActive

### Message
- conversationId, senderId, senderName
- content, type (text/image/file)
- fileUrl, fileName, fileSize
- read, readAt, reactions
- editedAt, editHistory, isDeleted

## Error Handling

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Next Steps

1. Implement authentication (JWT/OAuth)
2. Add validation middleware
3. Add error handling middleware
4. Add file upload functionality
5. Implement search functionality
6. Add rate limiting
7. Create admin dashboard endpoints
8. Add logging and monitoring
9. Implement notification system
10. Add email verification

## Project Structure

```
src/
├── app/
│   └── api/
│       ├── posts/
│       ├── users/
│       ├── comments/
│       ├── categories/
│       ├── study-sessions/
│       ├── partners/
│       ├── partner-requests/
│       ├── competitors/
│       ├── groups/
│       ├── competitions/
│       ├── conversations/
│       └── messages/
├── models/
│   ├── User.ts
│   ├── Post.ts
│   ├── Comment.ts
│   ├── Category.ts
│   ├── StudySession.ts
│   ├── Group.ts
│   ├── Competition.ts
│   ├── Partner.ts
│   ├── PartnerRequest.ts
│   ├── Conversation.ts
│   └── Message.ts
└── lib/
    └── mongodb.ts
```

## Testing

You can test the API using:
- Postman
- Thunder Client (VS Code Extension)
- cURL

Example:
```bash
# Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "slug": "test-post",
    "excerpt": "Test excerpt",
    "content": "Test content",
    "authorId": "user_id",
    "authorName": "John Doe",
    "category": "Learn",
    "status": "published"
  }'
```

## Support

For issues or questions, please create an issue in the repository.
