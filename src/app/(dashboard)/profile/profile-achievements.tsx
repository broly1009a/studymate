'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Medal } from "lucide-react";

const achievements = [
    {
        title: "🏆 Top 1 trong Data Science Challenge",
        description: "Đạt giải nhất trong cuộc thi Data Science Challenge quốc gia 2024.",
        year: 2024,
    },
    {
        title: "🧠 Bài nghiên cứu AI được xuất bản",
        description: "Xuất bản bài nghiên cứu AI trên Tạp chí Computer Vision.",
        year: 2023,
    },
    {
        title: "💻 Người chiến thắng Hackathon",
        description: "Dẫn dắt đội đến chiến thắng trong hackathon 48 giờ.",
        year: 2022,
    },
    {
        title: "🔥 Hoàn thành 100 Days of Code",
        description: "Code thành công trong 100 ngày liên tiếp để rèn luyện kỹ năng giải quyết vấn đề.",
        year: 2022,
    },
];

export function ProfileAchievements() {
    return (
        <Card className="border border-border/60 hover:shadow-md transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Medal className="w-5 h-5 text-amber-500" /> Thành tích
                </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-3">
                {achievements.map((a, index) => (
                    <div
                        key={index}
                        className="p-3 rounded-xl border bg-muted/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-400/50 hover:bg-background"
                    >
                        <h4 className="font-semibold text-sm md:text-base">{a.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{a.year}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
