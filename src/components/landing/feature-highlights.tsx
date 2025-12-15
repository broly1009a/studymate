import { Users, MessageSquare, UsersRound, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Users,
    title: 'Tìm bạn học',
    description: 'Kết nối với những người học phù hợp dựa trên môn học, phong cách học tập và lịch trình. Thuật toán thông minh đảm bảo kết nối tốt nhất.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: MessageSquare,
    title: 'Diễn đàn hỏi đáp',
    description: 'Đặt câu hỏi, chia sẻ kiến thức và giúp đỡ người khác. Nhận câu trả lời từ chuyên gia và xây dựng danh tiếng trong cộng đồng.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: UsersRound,
    title: 'Nhóm học',
    description: 'Tạo hoặc tham gia nhóm học với chat thời gian thực, tài nguyên chia sẻ và công cụ cộng tác. Học cùng nhau, đạt được nhiều hơn.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Trophy,
    title: 'Cuộc thi học thuật',
    description: 'Tham gia cuộc thi, thử thách bản thân và giành giải thưởng. Thi đấu cá nhân hoặc lập đội với bạn học của bạn.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export function FeatureHighlights() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Mọi thứ bạn cần để thành công
          </h2>
          <p className="text-lg text-muted-foreground">
            Các tính năng mạnh mẽ được thiết kế để nâng cao trải nghiệm học tập và giúp bạn đạt được mục tiêu học thuật.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

