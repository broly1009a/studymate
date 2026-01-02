# Hệ thống Partner Request - Tài liệu

## Tổng quan

Hệ thống Partner Request cho phép người dùng gửi yêu cầu học cùng cho nhau. Khi yêu cầu được chấp nhận, hệ thống tự động tạo conversation để hai người có thể nhắn tin.

## Luồng hoạt động

### 1. Gửi yêu cầu (Send Request)
- Người dùng vào trang chi tiết partner (`/matches/[id]`)
- Nhấn nút "Gửi yêu cầu học cùng"
- Viết tin nhắn giới thiệu (bắt buộc)
- Hệ thống:
  - Kiểm tra không gửi cho chính mình
  - Kiểm tra không có request pending trùng
  - Tạo PartnerRequest với status='pending'
  - Tạo Notification cho người nhận
  - Hiển thị badge "Đã gửi yêu cầu - Đang chờ phản hồi"

### 2. Nhận và xử lý yêu cầu (Receive & Process Request)
- Người nhận vào trang `/partner-requests`
- Tab "Nhận được" hiển thị các request pending
- Có 2 lựa chọn:
  - **Chấp nhận (Accept)**:
    - Cập nhật status='accepted'
    - Tự động tạo Conversation nếu chưa có
    - Tạo Notification cho người gửi
    - Cả 2 có thể vào `/messages` để chat
  - **Từ chối (Reject)**:
    - Cập nhật status='rejected'
    - Tạo Notification cho người gửi
    - Không tạo conversation

### 3. Hủy yêu cầu (Cancel Request)
- Người gửi có thể hủy request đang pending
- Vào tab "Đã gửi" trong `/partner-requests`
- Nhấn "Hủy yêu cầu" để xóa request

## API Endpoints

### GET /api/partner-requests
Lấy danh sách partner requests

**Query Parameters:**
- `userId`: ID của user
- `type`: 'sent' | 'received' | (không có = cả 2)
- `status`: 'pending' | 'accepted' | 'rejected'
- `page`: số trang (default: 1)
- `limit`: số items mỗi trang (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "senderId": "...",
      "senderName": "Nguyễn Văn A",
      "senderAvatar": "...",
      "receiverId": "...",
      "receiverName": "Trần Thị B",
      "receiverAvatar": "...",
      "subject": "Toán học",
      "message": "Chào bạn, mình muốn học cùng...",
      "status": "pending",
      "createdAt": "2026-01-02T...",
      "updatedAt": "2026-01-02T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### POST /api/partner-requests
Tạo partner request mới

**Body:**
```json
{
  "senderId": "user_id",
  "senderName": "Nguyễn Văn A",
  "senderAvatar": "https://...",
  "receiverId": "partner_id",
  "receiverName": "Trần Thị B",
  "receiverAvatar": "https://...",
  "subject": "Toán học",
  "message": "Chào bạn..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Partner request sent successfully",
  "data": { ... }
}
```

**Errors:**
- 400: Missing required fields
- 400: Cannot send request to yourself
- 400: You already have a pending request with this user

### GET /api/partner-requests/[id]
Lấy thông tin 1 partner request

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### PUT /api/partner-requests/[id]
Chấp nhận hoặc từ chối request

**Body:**
```json
{
  "status": "accepted", // hoặc "rejected"
  "userId": "receiver_id"
}
```

**Response khi accepted:**
```json
{
  "success": true,
  "message": "Partner request accepted successfully",
  "data": {
    "request": { ... },
    "conversation": { ... } // Conversation được tạo tự động
  }
}
```

**Errors:**
- 400: Invalid status
- 403: You are not authorized to update this request
- 404: Partner request not found
- 400: Request has already been {status}

### DELETE /api/partner-requests/[id]?userId={userId}
Hủy request (chỉ người gửi có thể hủy request pending)

**Response:**
```json
{
  "success": true,
  "message": "Partner request cancelled successfully"
}
```

**Errors:**
- 403: You are not authorized to delete this request
- 400: Cannot delete a request that has already been processed

## UI Components

### 1. Partner Detail Page (`/matches/[id]`)
- Hiển thị thông tin chi tiết của partner
- Nút gửi yêu cầu hoặc trạng thái request hiện tại:
  - Chưa gửi: "Gửi yêu cầu học cùng"
  - Pending: Badge "Đã gửi yêu cầu - Đang chờ phản hồi"
  - Accepted: Nút "Nhắn tin"
  - Rejected: Badge "Yêu cầu đã bị từ chối"

### 2. Partner Requests Page (`/partner-requests`)
- Tab "Nhận được": Hiển thị requests người khác gửi cho mình
  - Pending: Nút Accept/Reject
  - Accepted/Rejected: Hiển thị trạng thái
- Tab "Đã gửi": Hiển thị requests mình gửi cho người khác
  - Pending: Nút "Hủy yêu cầu"
  - Accepted: Nút "Nhắn tin"
  - Rejected: Hiển thị trạng thái

### 3. Hook: usePartnerRequests
```typescript
import { usePartnerRequests } from '@/hooks/use-partner-requests';

function MyComponent() {
  const { unreadCount, loading } = usePartnerRequests();
  
  // unreadCount = số lượng pending requests
  // Có thể dùng để hiển thị badge trong nav
}
```

## Database Models

### PartnerRequest Model
```typescript
{
  senderId: ObjectId (ref: User),
  senderName: String,
  senderAvatar: String,
  receiverId: ObjectId (ref: User),
  receiverName: String,
  receiverAvatar: String,
  subject: String (max: 100),
  message: String (max: 500),
  status: 'pending' | 'accepted' | 'rejected',
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- senderId
- receiverId
- status
- createdAt (desc)

## Notifications

Hệ thống tự động tạo notifications trong các trường hợp:

1. **Khi gửi request mới:**
   - Người nhận: "Yêu cầu học cùng mới từ {senderName}"

2. **Khi accept request:**
   - Người gửi: "{receiverName} đã chấp nhận yêu cầu học cùng của bạn"

3. **Khi reject request:**
   - Người gửi: "{receiverName} đã từ chối yêu cầu học cùng của bạn"

## Conversation Auto-creation

Khi partner request được accepted:
- Kiểm tra xem đã có conversation giữa 2 người chưa
- Nếu chưa có, tạo mới với:
  - participants: [senderId, receiverId]
  - participantNames: [senderName, receiverName]
  - lastMessage: "{receiverName} đã chấp nhận yêu cầu học cùng"
  - unreadCounts: { senderId: 1, receiverId: 0 }
  - subject: từ partner request
  - isActive: true

## Best Practices

1. **Validation:**
   - Luôn validate userId khi accept/reject/cancel
   - Kiểm tra trùng lặp request
   - Không cho gửi request cho chính mình

2. **Security:**
   - Chỉ receiver mới được accept/reject
   - Chỉ sender mới được cancel pending request
   - Không cho delete/update request đã processed

3. **UX:**
   - Hiển thị trạng thái rõ ràng
   - Tự động redirect đến /messages khi accept
   - Disable nút khi đang xử lý
   - Polling hoặc websocket để update real-time

4. **Performance:**
   - Index đúng fields để query nhanh
   - Pagination cho danh sách requests
   - Cache unread count ở client

## Mở rộng trong tương lai

1. **Real-time updates** với WebSocket/Socket.io
2. **Push notifications** khi có request mới
3. **Request templates** để gửi nhanh
4. **Block/Report** user spam
5. **Request expiration** tự động sau X ngày
6. **Analytics** về tỷ lệ accept/reject
