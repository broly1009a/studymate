import { Header } from '@/components/shared/header';
import { Chatbot } from '@/components/shared/chatbot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="w-full px-8 py-6">
          {children}
        </div>
      </main>
      <Chatbot />
    </div>
  );
}

