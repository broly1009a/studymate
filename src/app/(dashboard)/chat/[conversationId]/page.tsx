import ChatRealtime from '@/components/chat/chat-realtime';

interface ChatPageProps {
  params: {
    conversationId: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  // In a real app, get current user from auth context
  const currentUserId = 'user123'; // Replace with actual user ID
  const currentUserName = 'Test User'; // Replace with actual user name

  return (
    <div className="container mx-auto h-screen flex flex-col">
      <div className="flex-1">
        <ChatRealtime
          conversationId={params.conversationId}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
        />
      </div>
    </div>
  );
}