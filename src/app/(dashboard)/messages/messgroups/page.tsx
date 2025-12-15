'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Paperclip, Phone, Video, Info, Send, Smile, Search } from 'lucide-react';

type Group = {
    id: number;
    name: string;
    lastMessage: string;
    members: string[];
    avatar: string;
    unread?: number;
    online?: boolean;
    lastSeen?: string;
};

type Msg = { id: number; sender: string; text: string; me?: boolean; time?: string };

export default function MessGroups() {
    const [activeGroup, setActiveGroup] = useState<number>(1);
    const [draft, setDraft] = useState('');
    const [showInfoPanel, setShowInfoPanel] = useState(false); // 👈 toggle panel
    const scrollRef = useRef<HTMLDivElement>(null);

    const groups: Group[] = [
        {
            id: 1,
            name: 'Lớp JavaScript',
            lastMessage: 'Mai học lúc 8h nha mọi người!',
            members: ['An', 'Bình', 'Chi'],
            avatar: '/java.png',
            unread: 2,
            online: true,
            lastSeen: 'vừa xong',
        },
        {
            id: 2,
            name: 'Nhóm học NextJS',
            lastMessage: 'Deploy xong chưa ae?',
            members: ['Minh', 'Lan', 'Tuấn'],
            avatar: '/nextjs.png',
            unread: 0,
            lastSeen: '5 phút',
        },
        {
            id: 3,
            name: 'Đồ án cuối kỳ',
            lastMessage: 'Review code tối nay nhé',
            members: ['Hà', 'Nam', 'Thảo'],
            avatar: '/anhtotnghiep.jpg',
            unread: 1,
            lastSeen: '1 giờ',
        },
    ];

    const allMessages: Record<number, Msg[]> = useMemo(
        () => ({
            1: [
                { id: 1, sender: 'An', text: 'Cả nhóm ơi mai học nha!', time: '09:15' },
                { id: 2, sender: 'Tôi', text: 'Ok nha 💪', me: true, time: '09:16' },
                { id: 3, sender: 'Bình', text: '8h sáng như cũ nha!', time: '09:17' },
            ],
            2: [
                { id: 1, sender: 'Minh', text: 'Deploy xong chưa?', time: '10:02' },
                { id: 2, sender: 'Tôi', text: 'Đang build preview.', me: true, time: '10:03' },
            ],
            3: [
                { id: 1, sender: 'Hà', text: 'Review code tối nay nhé', time: '08:00' },
                { id: 2, sender: 'Tôi', text: 'Tôi confirm 9h!', me: true, time: '08:02' },
            ],
        }),
        []
    );

    const msgs = allMessages[activeGroup] ?? [];
    const active = groups.find((g) => g.id === activeGroup)!;

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [activeGroup, msgs.length]);

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* ===== Sidebar ===== */}
            <aside className="hidden md:flex w-[320px] shrink-0 border-r bg-muted/30 backdrop-blur-sm">
                <div className="flex flex-col w-full">
                    {/* Sidebar header */}
                    <div className="sticky top-0 z-10 p-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold">Chats</h1>
                            <Button size="sm" variant="outline" className="gap-2">
                                <Search className="h-4 w-4" />
                                Tìm
                            </Button>
                        </div>
                        <div className="mt-3">
                            <Input placeholder="Search Messenger" className="h-9" />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {groups.map((g) => {
                            const isActive = activeGroup === g.id;
                            return (
                                <button
                                    key={g.id}
                                    onClick={() => setActiveGroup(g.id)}
                                    className={`group w-full text-left rounded-xl px-3 py-2 flex items-center gap-3 transition
                    ${isActive ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-muted'}
                  `}
                                >
                                    <div className="relative">
                                        <Image
                                            src={g.avatar}
                                            alt={g.name}
                                            width={44}
                                            height={44}
                                            className="rounded-full object-cover"
                                        />
                                        {g.online && (
                                            <span className="absolute -right-0 -bottom-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium truncate">{g.name}</p>
                                            <span className="text-xs text-muted-foreground">{g.lastSeen}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{g.lastMessage}</p>
                                    </div>

                                    {g.unread ? (
                                        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] px-1">
                                            {g.unread}
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* ===== Chat area ===== */}
            <section className="flex-1 flex flex-col">
                {/* Header */}
                <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="relative md:hidden">
                                <Image
                                    src={active.avatar}
                                    width={40}
                                    height={40}
                                    alt={active.name}
                                    className="rounded-full object-cover"
                                />
                                {active.online && (
                                    <span className="absolute -right-0 -bottom-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                                )}
                            </div>
                            <div>
                                <h2 className="font-semibold text-base md:text-lg">{active.name}</h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {active.members.join(', ')}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button size="icon" variant="outline" className="rounded-full">
                                <Phone className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full">
                                <Video className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant={showInfoPanel ? 'default' : 'outline'}
                                className="rounded-full"
                                onClick={() => setShowInfoPanel((v) => !v)} // 👈 toggle
                            >
                                <Info className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 md:px-6 py-4 bg-muted/20">
                    <div className="relative flex items-center my-2">
                        <Separator className="flex-1" />
                        <span className="mx-3 text-xs text-muted-foreground">Hôm nay</span>
                        <Separator className="flex-1" />
                    </div>

                    <div className="space-y-2 md:space-y-3">
                        {allMessages[activeGroup]?.map((m) => (
                            <div key={m.id} className={`flex ${m.me ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={[
                                        'max-w-[80%] md:max-w-[65%] px-3.5 py-2.5 rounded-2xl shadow-sm',
                                        m.me
                                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                                            : 'bg-card text-card-foreground border rounded-bl-sm',
                                    ].join(' ')}
                                >
                                    <p className="text-[15px] leading-relaxed">{m.text}</p>
                                    <div className={`mt-1 text-[11px] ${m.me ? 'text-white/80' : 'text-muted-foreground'}`}>
                                        {m.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Composer */}
                <div className="border-t p-3 md:p-4">
                    <div className="flex items-end gap-2 md:gap-3">
                        <Button size="icon" variant="ghost" className="rounded-full">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-full">
                            <Smile className="h-5 w-5" />
                        </Button>

                        <div className="flex-1">
                            <Input
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="Nhắn tin cho nhóm…"
                                className="h-11 rounded-full px-4"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && draft.trim()) {
                                        setDraft('');
                                        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
                                    }
                                }}
                            />
                        </div>

                        <Button className="rounded-full h-11 px-5 gap-2">
                            <Send className="h-4 w-4" />
                            Gửi
                        </Button>
                    </div>
                </div>
            </section>

            {/* ===== Right info panel (toggle bằng ℹ️) ===== */}
            <aside
                className={`border-l bg-muted/30 transition-all duration-300 ease-in-out
          ${showInfoPanel ? 'w-[320px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}
        `}
            >
                <div className={`p-6 ${!showInfoPanel ? 'hidden' : ''}`}>
                    <div className="flex flex-col items-center text-center">
                        <div className="relative">
                            <Image
                                src={active.avatar}
                                width={84}
                                height={84}
                                alt={active.name}
                                className="rounded-full object-cover ring-4 ring-background shadow"
                            />
                            {active.online && (
                                <span className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-background" />
                            )}
                        </div>
                        <h3 className="font-semibold text-lg mt-3">{active.name}</h3>
                        <p className="text-muted-foreground text-sm">
                            {active.online ? 'Đang hoạt động' : `Hoạt động ${active.lastSeen} trước`}
                        </p>
                    </div>

                    <div className="mt-6 space-y-2">
                        <Button variant="outline" className="w-full">Xem hồ sơ</Button>
                        <Button variant="outline" className="w-full">Tắt thông báo</Button>
                        <Button variant="outline" className="w-full">Tìm kiếm</Button>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Thành viên</h4>
                        <div className="space-y-2">
                            {active.members.map((m, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-full bg-muted" />
                                    <span>{m}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button variant="destructive" className="w-full">Rời nhóm</Button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
