import { useState, useEffect } from 'react';
import { Play, Square, Download, MessageSquare, Clock, Trash2, Menu, Copy, Check, Library, FolderOpen } from 'lucide-react';
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
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('easyvoice_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const voices = [
    { id: 'an-female', name: 'An', region: 'Miền Bắc', emoji: '👩' },
    { id: 'nam-male', name: 'Nam', region: 'Miền Bắc', emoji: '👨' },
    { id: 'lan-female', name: 'Lan', region: 'Miền Nam', emoji: '👩' },
    { id: 'hung-male', name: 'Hùng', region: 'Miền Nam', emoji: '👨' },
  ];

  const sidebarItems = [
    { id: 'tts', icon: <MessageSquare size={20} />, label: 'Chuyển văn bản' },
    { id: 'library', icon: <Library size={20} />, label: 'Thư viện giọng' },
    { id: 'projects', icon: <FolderOpen size={20} />, label: 'Dự án của tôi' },
  ];

  const insertPause = (seconds: number) => {
    setText(prev => prev + `[pause=${seconds}s] `);
  };

  const speakWithPauses = (fullText: string) => {
    if (!fullText.trim()) return;
    
    if (!history.includes(fullText.trim())) {
      const newHistory = [fullText.trim(), ...history].slice(0, 6);
      setHistory(newHistory);
      localStorage.setItem('easyvoice_history', JSON.stringify(newHistory));
    }

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
        utterance.onend = () => { index++; speakNext(); };
        window.speechSynthesis.speak(utterance);
      } else { index++; speakNext(); }
    };
    setIsSpeaking(true);
    speakNext();
  };

  const handleDownload = () => {
    const cleanText = text.replace(/\[pause[:=]?\s*\d*\.?\d+s?\]/gi, "").trim();
    if (!cleanText) return alert("Nhập nội dung!");
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText.slice(0, 200))}&tl=vi&client=tw-ob`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0 bg-fixed" style={{ backgroundImage: `url('https://files.catbox.moe/lovccc.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 z-0 bg-black/80 backdrop-blur-[1px]"></div>

      {/* SIDEBAR: CHỈ ĐỂ CHỌN CÁC MỤC */}
      <aside className={cn("relative z-20 h-full bg-zinc-950/90 backdrop-blur-2xl border-r border-white/5 w-72 flex flex-col transition-all duration-300", !sidebarOpen && "-ml-72")}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><Play size={20} fill="white" /></div>
          <div>
            <h1 className="text-xl font-black italic">EasyVoice</h1>
            <p className="text-[10px] uppercase text-indigo-400 font-bold">Phòng thu Studio</p>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {sidebarItems.map(item => (
            <button key={item.id} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all", item.id === 'tts' ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" : "text-zinc-500 hover:bg-white/5")}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col relative z-10">
        <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-sm flex items-center px-8 justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-800 rounded-lg"><Menu size={24} /></button>
          <div className="flex items-center gap-2">
            {isSpeaking && <div className="flex gap-1 items-end h-4">{[...Array(5)].map((_, i) => <div key={i} className="w-1 bg-indigo-500 rounded-full animate-wave" style={{ animationDelay: `${i * 0.1}s` }} />)}</div>}
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Live Workspace</span>
          </div>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-6">
              {/* KHUNG NHẬP VĂN BẢN */}
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Bắt đầu sáng tạo tại đây..."
                  className="w-full h-[400px] bg-transparent text-3xl lg:text-4xl text-zinc-100 placeholder:text-zinc-900 focus:outline-none resize-none leading-tight"
                />
                <div className="absolute top-8 right-8 flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-3 bg-zinc-900 rounded-xl hover:text-indigo-400 border border-white/5">{copied ? <Check size={20} /> : <Copy size={20} />}</button>
                </div>
                <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
                  <div className="flex-1 flex gap-2">
                    {[0.5, 1, 2].map(s => ( <button key={s} onClick={() => insertPause(s)} className="px-4 py-2 bg-zinc-900 hover:bg-indigo-600 border border-white/10 rounded-lg text-[10px] font-black tracking-widest transition-all">+{s}S</button> ))}
                  </div>
                  <button onClick={() => setText('')} className="p-3 text-zinc-600 hover:text-red-400 transition-all"><Trash2 size={24} /></button>
                </div>
              </div>

              {/* LỊCH SỬ GẦN ĐÂY: ĐÃ CHUYỂN XUỐNG DƯỚI KHUNG NHẬP */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-500 px-2 uppercase tracking-[0.2em] text-[10px] font-black">
                  <Clock size={12} /> Lịch sử vừa phát
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {history.map((item, i) => (
                    <button key={i} onClick={() => setText(item)} className="text-left p-4 rounded-2xl bg-zinc-950/50 hover:bg-indigo-600/20 border border-white/5 transition-all">
                      <p className="text-sm text-zinc-400 line-clamp-1">{item}</p>
                    </button>
                  ))}
                  {history.length === 0 && <p className="text-xs text-zinc-700 px-2 italic">Chưa có lịch sử...</p>}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              {/* CHỌN GIỌNG */}
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2rem] p-6 shadow-xl">
                <p className="text-[10px] font-bold uppercase text-zinc-500 mb-4 tracking-widest text-center">Giọng đọc chuyên nghiệp</p>
                <div className="grid grid-cols-2 gap-2">
                  {voices.map(v => (
                    <button key={v.id} onClick={() => setSelectedVoice(v.id)} className={cn("p-4 rounded-xl border transition-all flex flex-col items-center", selectedVoice === v.id ? "border-indigo-500 bg-indigo-600/40 text-white shadow-lg" : "border-white/5 bg-zinc-900 text-zinc-600 hover:bg-zinc-800")}>
                      <span className="text-3xl">{v.emoji}</span>
                      <span className="text-[10px] font-bold mt-2 tracking-widest">{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TÙY CHỈNH: ĐÃ CÓ LẠI CAO ĐỘ */}
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2rem] p-6 space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest"><span>Tốc độ</span><span className="text-indigo-400 font-black">{speed}x</span></div>
                  <input type="range" min="0.5" max="2" step="0.05" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full h-1 accent-indigo-500" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest"><span>Cao độ</span><span className="text-indigo-400 font-black">{pitch}</span></div>
                  <input type="range" min="0" max="2" step="0.05" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full h-1 accent-indigo-500" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest"><span>Âm lượng</span><span className="text-indigo-400 font-black">{Math.round(volume * 100)}%</span></div>
                  <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-full h-1 accent-indigo-500" />
                </div>
                <button onClick={handleDownload} className="w-full py-4 bg-zinc-900 border border-white/10 hover:bg-indigo-600 hover:text-white text-zinc-500 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold transition-all"><Download size={18} /> TẢI MP3</button>
              </div>

              {/* NÚT PHÁT CHÍNH */}
              <button onClick={isSpeaking ? () => { window.speechSynthesis.cancel(); setIsSpeaking(false); } : () => speakWithPauses(text)} className={cn("w-full py-8 rounded-[2.5rem] text-2xl font-black flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl", isSpeaking ? "bg-red-600" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/40")}>
                {isSpeaking ? <><Square size={28} fill="currentColor" /> DỪNG PHÁT</> : <><Play size={28} fill="currentColor" /> PHÁT NGAY</>}
              </button>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes wave { 0%, 100% { height: 4px; } 50% { height: 16px; } }
        .animate-wave { animation: wave 0.6s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        input[type='range'] { -webkit-appearance: none; background: #18181b; height: 4px; border-radius: 2px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: #6366f1; border-radius: 50%; cursor: pointer; border: 2px solid #fff; shadow: 0 0 10px rgba(99,102,241,0.5); }
      `}</style>
    </div>
  );
}