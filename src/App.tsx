import { useState, useEffect, useRef } from 'react';
import { Play, Square, Download, MessageSquare, Clock, Trash2, Menu, Copy, Check, Headphones, Mic2 } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('vi-VN-HoaiBanhNeural');
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const voices = [
    { id: 'vi-VN-HoaiBanhNeural', name: 'Hoài Bằng', desc: 'Nam - Ấm áp', emoji: '🧔' },
    { id: 'vi-VN-NamMinhNeural', name: 'Nam Minh', desc: 'Nam - Tin tức', emoji: '👨‍💼' },
    { id: 'vi-VN-MaiChiNeural', name: 'Mai Chi', desc: 'Nữ - Truyền cảm', emoji: '👩' },
    { id: 'vi-VN-HoaiMyNeural', name: 'Hoài My', desc: 'Nữ - Nhẹ nhàng', emoji: '👧' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('easyvoice_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const insertPause = (seconds: number) => {
    setText(prev => prev + `[pause=${seconds}s] `);
  };

  const speakAzure = async () => {
    if (!text.trim() || isSpeaking) return;

    if (!history.includes(text.trim())) {
      const newHistory = [text.trim(), ...history].slice(0, 6);
      setHistory(newHistory);
      localStorage.setItem('easyvoice_history', JSON.stringify(newHistory));
    }

    setIsSpeaking(true);

    // Tách văn bản và khoảng nghỉ
    const regex = /(\[pause[:=]?\s*\d*\.?\d+s?\])/i;
    const parts = text.split(regex);
    
    try {
      for (let part of parts) {
        if (!part.trim()) continue;

        const pauseMatch = part.match(/\[pause[:=]?\s*(\d*\.?\d+)s?\]/i);
        if (pauseMatch) {
          const seconds = parseFloat(pauseMatch[1]);
          await new Promise(resolve => setTimeout(resolve, seconds * 1000));
          continue;
        }

        // Gọi API lách Microsoft Edge cực ổn định
        const pitchVal = Math.floor((pitch - 1) * 50);
        const speedVal = Math.floor((speed - 1) * 100);
        const url = `https://api.vncool.com/api/tts?text=${encodeURIComponent(part)}&voice=${selectedVoice}&speed=${speedVal}&pitch=${pitchVal}&volume=0`;
        
        await new Promise((resolve, reject) => {
          const audio = new Audio(url);
          audio.volume = volume;
          audioRef.current = audio;
          audio.onended = resolve;
          audio.onerror = () => reject("Lỗi server");
          audio.play().catch(reject);
        });
      }
    } catch (error) {
      alert("Server giọng nói đang bận, bro nhấn 'Phát Lại' thử xem!");
    } finally {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
    window.speechSynthesis.cancel(); // Dừng tất cả
  };

  const handleDownload = () => {
    const cleanText = text.replace(/\[pause[:=]?\s*\d*\.?\d+s?\]/gi, "").trim();
    if (!cleanText) return;
    const pitchVal = Math.floor((pitch - 1) * 50);
    const speedVal = Math.floor((speed - 1) * 100);
    const url = `https://api.vncool.com/api/tts?text=${encodeURIComponent(cleanText.slice(0, 500))}&voice=${selectedVoice}&speed=${speedVal}&pitch=${pitchVal}&download=1`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-black text-white font-sans">
      <div className="absolute inset-0 z-0 bg-fixed" style={{ backgroundImage: `url('https://files.catbox.moe/lovccc.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 z-0 bg-black/85 backdrop-blur-[1px]"></div>

      <aside className={cn("relative z-20 h-full bg-zinc-950/90 backdrop-blur-2xl border-r border-white/5 w-72 flex flex-col transition-all duration-300", !sidebarOpen && "-ml-72")}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><Play size={20} fill="white" /></div>
          <div><h1 className="text-xl font-black italic tracking-tighter">EasyVoice</h1><p className="text-[10px] uppercase text-indigo-400 font-bold">Studio Studio</p></div>
        </div>
        <nav className="p-4 space-y-2">
          <div className="px-4 py-4 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-2xl text-sm font-bold flex items-center gap-3">
            <Mic2 size={18} /> Giọng Người Thật
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col relative z-10">
        <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-sm flex items-center px-8 justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-800 rounded-lg"><Menu size={24} /></button>
          <div className="flex items-center gap-2">
            {isSpeaking && <div className="flex gap-1 items-end h-4">{[...Array(5)].map((_, i) => <div key={i} className="w-1 bg-indigo-500 rounded-full animate-wave" style={{ animationDelay: `${i * 0.1}s` }} />)}</div>}
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">EasyVoice Live</span>
          </div>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Bắt đầu nhập nội dung..."
                  className="w-full h-[400px] bg-transparent text-3xl lg:text-4xl text-zinc-100 placeholder:text-zinc-900 focus:outline-none resize-none leading-tight"
                />
                <div className="absolute top-8 right-8 flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-3 bg-zinc-900 rounded-xl hover:text-indigo-400 border border-white/5">{copied ? <Check size={20} /> : <Copy size={20} />}</button>
                </div>
                <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
                  <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center mr-2 whitespace-nowrap">Chèn nghỉ:</span>
                    {[0.5, 1, 1.5, 2].map(s => (
                      <button key={s} onClick={() => insertPause(s)} className="px-5 py-2.5 bg-zinc-900 hover:bg-indigo-600 border border-white/10 rounded-xl text-xs font-bold transition-all">+{s}s</button>
                    ))}
                  </div>
                  <button onClick={() => setText('')} className="p-3 text-zinc-600 hover:text-red-400 transition-all"><Trash2 size={24} /></button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-500 px-2 uppercase tracking-[0.2em] text-[10px] font-black"><Clock size={12} /> Lịch sử phát</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {history.map((item, i) => (
                    <button key={i} onClick={() => setText(item)} className="text-left p-4 rounded-2xl bg-zinc-950/50 hover:bg-indigo-600/20 border border-white/5 transition-all"><p className="text-sm text-zinc-400 line-clamp-1">{item}</p></button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2rem] p-6 shadow-xl">
                <p className="text-[10px] font-bold uppercase text-zinc-500 mb-4 tracking-widest text-center">Giọng Azure Neural</p>
                <div className="grid grid-cols-1 gap-2">
                  {voices.map(v => (
                    <button key={v.id} onClick={() => setSelectedVoice(v.id)} className={cn("flex items-center gap-4 p-4 rounded-2xl border transition-all text-left", selectedVoice === v.id ? "border-indigo-500 bg-indigo-600/30 shadow-lg" : "border-white/5 bg-zinc-900 hover:bg-zinc-800")}>
                      <span className="text-3xl">{v.emoji}</span>
                      <div><p className="text-sm font-bold text-white">{v.name}</p><p className="text-[10px] text-zinc-500">{v.desc}</p></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-950/90 border border-white/10 rounded-[2rem] p-8 space-y-8 shadow-xl">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-3 uppercase"><span>Tốc độ</span><span className="text-indigo-400 font-black">{speed}x</span></div>
                  <input type="range" min="0.5" max="2" step="0.05" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full h-1.5 accent-indigo-500" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-3 uppercase"><span>Cao độ</span><span className="text-indigo-400 font-black">{pitch}</span></div>
                  <input type="range" min="0" max="2" step="0.05" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full h-1.5 accent-indigo-500" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-3 uppercase"><span>Âm lượng</span><span className="text-indigo-400 font-black">{Math.round(volume * 100)}%</span></div>
                  <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-full h-1.5 accent-indigo-500" />
                </div>
              </div>

              <button onClick={handleDownload} className="w-full py-4 bg-zinc-900 border border-white/10 hover:bg-white/5 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold transition-all"><Download size={18} /> TẢI FILE MP3</button>

              <button onClick={isSpeaking ? stopSpeaking : speakAzure} className={cn("w-full py-8 rounded-[2.5rem] text-2xl font-black flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95", isSpeaking ? "bg-red-600 shadow-red-500/20" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/40")}>
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
        input[type='range'] { -webkit-appearance: none; background: #18181b; height: 6px; border-radius: 3px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: #6366f1; border-radius: 50%; cursor: pointer; border: 2px solid #fff; }
      `}</style>
    </div>
  );
}