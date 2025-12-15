import { Card } from '@/components/ui/card';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">StudyMate</h1>
          <p className="text-muted-foreground">Collaborative Learning Platform</p>
        </div>
        <Card className="p-6 shadow-lg">
          {children}
        </Card>
      </div>
    </div>
  );
}

