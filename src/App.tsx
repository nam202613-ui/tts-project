import { useState } from 'react';
import { Play, Square, Download, Copy, Trash2, Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('an-female');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const voices = [
    { id: 'an-female', name: 'An', region: 'Miền Bắc', emoji: '👩' },
    { id: 'nam-male', name: 'Nam', region: 'Miền Bắc', emoji: '👨' },
    { id: 'lan-female', name: 'Lan', region: 'Miền Nam', emoji: '👩' },
    { id: 'hung-male', name: 'Hùng', region: 'Miền Nam', emoji: '👨' },
    { id: 'mai-female', name: 'Mai', region: 'Miền Trung', emoji: '👩' },
  ];

  const insertPause = (seconds: number) => {
    setText(prev => prev + `[pause=${seconds}s] `);
  };

  const speakWithPauses = (fullText: string) => {
    if (!fullText.trim()) return;
    window.speechSynthesis.cancel();
    const parts = fullText.split(/(\[pause[:=]?\s*\d*\.?\d+s?\])/i);
    let index = 0;
    const speakNext = () => {
      if (index >= parts.length) { setIsSpeaking(false); return; }
      const current = parts[index].trim();
      if (current.match(/\[pause[:=]?\s*(\d*\.?\d+)s?\]/i)) {
        const match = current.match(/(\d*\.?\d+)/);
        const pauseTime = match ? parseFloat(match[0]) * 1000 : 500;
        index++;
        setTimeout(speakNext, pauseTime);
      } else if (current) {
        const utterance = new SpeechSynthesisUtterance(current);
        utterance.rate = speed; utterance.pitch = pitch; utterance.volume = volume; utterance.lang = 'vi-VN';
        const voicesList = window.speechSynthesis.getVoices();
        const vnVoice = voicesList.find(v => v.lang.includes('vi'));
        if (vnVoice) utterance.voice = vnVoice;
        utterance.onend = () => { index++; speakNext(); };
        window.speechSynthesis.speak(utterance);
      } else { index++; speakNext(); }
    };
    setIsSpeaking(true);
    speakNext();
  };

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-black text-white">
      {/* 1. HÌNH NỀN */}
      <div 
        className="absolute inset-0 z-0 bg-fixed"
        style={{
          backgroundImage: `url('https://files.catbox.moe/lovccc.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* 2. LỚP PHỦ ĐEN ĐẬM */}
      <div className="absolute inset-0 z-0 bg-black/80"></div>

      {/* 3. SIDEBAR */}
      <aside className={cn(
        "relative z-20 h-full bg-zinc-950 border-r border-white/5 w-72 flex flex-col transition-all duration-300",
        !sidebarOpen && "-ml-72"
      )}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Play size={24} fill="white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">EasyVoice</h1>
            <p className="text-[10px] uppercase text-indigo-400 font-bold tracking-widest">Phòng thu Studio</p>
          </div>
        </div>
        <div className="p-4 flex-1">
          <div className="px-4 py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-base font-bold text-indigo-300 text-center">
            Chuyển văn bản
          </div>
        </div>
      </aside>

      {/* 4. NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col relative z-10">
        <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-sm flex items-center px-8 justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-800 rounded-lg">
            <Menu size={28} />
          </button>
          <span className="text-xs font-bold uppercase tracking-[0.5em] text-zinc-500">Bảng điều khiển Studio</span>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* CỘT TRÁI: Ô NHẬP LIỆU (Cỡ chữ to) */}
            <div className="lg:col-span-8">
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Bắt đầu nhập nội dung tại đây..."
                  className="w-full h-[450px] bg-transparent text-2xl lg:text-3xl text-zinc-100 placeholder:text-zinc-800 focus:outline-none resize-none leading-relaxed"
                />

                <div className="mt-8 flex items-center gap-6 border-t border-white/5 pt-8">
                  <div className="flex-1">
                    <span className="text-xs font-black uppercase text-zinc-500 tracking-wider">Khoảng nghỉ</span>
                    <div className="flex gap-3 mt-3">
                      {[0.5, 1, 1.5, 2].map(s => (
                        <button
                          key={s}
                          onClick={() => insertPause(s)}
                          className="px-6 py-3 bg-zinc-900 hover:bg-indigo-600 border border-white/10 rounded-xl text-sm font-bold transition-all"
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setText('')} className="p-4 text-zinc-600 hover:text-red-400 transition-all">
                    <Trash2 size={32} />
                  </button>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: CÀI ĐẶT */}
            <div className="lg:col-span-4 space-y-8">
              {/* CHỌN GIỌNG */}
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2rem] p-8 shadow-xl">
                <p className="text-xs font-black uppercase text-zinc-500 mb-6 tracking-widest">Giọng đọc</p>
                <div className="grid grid-cols-2 gap-4">
                  {voices.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVoice(v.id)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2",
                        selectedVoice === v.id 
                          ? "border-indigo-500 bg-indigo-600/30 text-white shadow-lg" 
                          : "border-white/5 bg-zinc-900 text-zinc-500 hover:bg-zinc-800"
                      )}
                    >
                      <span className="text-4xl">{v.emoji}</span>
                      <span className="text-xs font-bold">{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* THANH TRƯỢT (Slider to hơn) */}
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2rem] p-8 space-y-8 shadow-xl">
                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-500 mb-4">
                    <span>TỐC ĐỘ</span>
                    <span className="text-indigo-400">{speed}x</span>
                  </div>
                  <input type="range" min="0.5" max="2" step="0.05" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full h-2 accent-indigo-500" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-500 mb-4">
                    <span>ÂM LƯỢNG</span>
                    <span className="text-indigo-400">{Math.round(volume * 100)}%</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-full h-2 accent-indigo-500" />
                </div>
              </div>

              {/* NÚT PHÁT CHÍNH (Siêu to) */}
              <button
                onClick={isSpeaking ? stopSpeaking : () => speakWithPauses(text)}
                className={cn(
                  "w-full py-8 rounded-[2.5rem] text-3xl font-black flex items-center justify-center gap-4 transition-all active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.3)]",
                  isSpeaking 
                    ? "bg-red-600" 
                    : "bg-indigo-600 hover:bg-indigo-500"
                )}
              >
                {isSpeaking ? (
                  <><Square size={36} fill="currentColor" /> DỪNG</>
                ) : (
                  <><Play size={36} fill="currentColor" className="ml-1" /> PHÁT NGAY</>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        input[type='range'] { -webkit-appearance: none; background: #18181b; height: 6px; border-radius: 3px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #6366f1; border-radius: 50%; cursor: pointer; border: 3px solid #fff; }
      `}</style>
    </div>
  );
}