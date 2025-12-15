import { TrendingUp, Users, MessageSquare, Award } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Học viên hoạt động',
    description: 'Tham gia cùng hàng nghìn học viên đang học cùng nhau',
  },
  {
    icon: MessageSquare,
    value: '50,000+',
    label: 'Câu hỏi đã trả lời',
    description: 'Nhận trợ giúp từ cộng đồng giàu kiến thức',
  },
  {
    icon: TrendingUp,
    value: '95%',
    label: 'Tỷ lệ thành công',
    description: 'Học viên báo cáo cải thiện điểm số',
  },
  {
    icon: Award,
    value: '100+',
    label: 'Cuộc thi',
    description: 'Thử thách bản thân và giành giải thưởng',
  },
];

export function Statistics() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Tạo ra tác động thực sự
          </h2>
          <p className="text-lg opacity-90">
            Nền tảng của chúng tôi đang giúp học viên đạt được mục tiêu học thuật mỗi ngày.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-4">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <p className="text-sm opacity-80">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

