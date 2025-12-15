import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Nguyễn Minh Anh',
    role: 'Sinh viên Khoa học Máy tính',
    avatar: '',
    content: 'StudyMate đã giúp tôi tìm được bạn học hoàn hảo cho khóa thuật toán. Chúng tôi gặp nhau hai lần một tuần và điểm số của tôi đã cải thiện đáng kể!',
    rating: 5,
  },
  {
    name: 'Trần Hoàng Long',
    role: 'Sinh viên Toán học',
    avatar: '',
    content: 'Diễn đàn hỏi đáp thật tuyệt vời! Tôi nhận được câu trả lời nhanh chóng và cũng thích giúp đỡ người khác. Cộng đồng rất hỗ trợ.',
    rating: 5,
  },
  {
    name: 'Lê Thị Hương',
    role: 'Sinh viên Vật lý',
    avatar: '',
    content: 'Nhóm học trên StudyMate thật tuyệt vời. Các công cụ cộng tác giúp chia sẻ ghi chú và làm bài tập cùng nhau dễ dàng.',
    rating: 5,
  },
  {
    name: 'Phạm Đức Anh',
    role: 'Sinh viên Kỹ thuật',
    avatar: '',
    content: 'Tôi yêu thích các cuộc thi! Chúng thúc đẩy tôi học nhiều hơn và giải thưởng là động lực tuyệt vời. Hơn nữa, tôi đã kết bạn với nhiều người tuyệt vời.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Được yêu thích bởi học viên toàn cầu
          </h2>
          <p className="text-lg text-muted-foreground">
            Xem cộng đồng của chúng tôi nói gì về trải nghiệm với StudyMate.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

