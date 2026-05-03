import { useState, useEffect } from 'react';
import { Play, Square, MessageSquare, Clock, Trash2, Menu, Copy, Check, Headphones, Mic2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('vi-VN-HoaiBanhNeural'); // Giọng Hoài Bằng mặc định

  // Danh sách giọng đọc Microsoft Azure Natural (Giống tts.ohfree.me)
  const azureVoices = [
    { id: 'vi-VN-HoaiBanhNeural', name: 'Hoài Bằng', desc: 'Nam - Ấm áp', emoji: '🧔' },
    { id: 'vi-VN-NamMinhNeural', name: 'Nam Minh', desc: 'Nam - Tin tức', emoji: '👨‍💼' },
    { id: 'vi-VN-MaiChiNeural', name: 'Mai Chi', desc: 'Nữ - Truyền cảm', emoji: '👩' },
    { id: 'vi-VN-HoaiMyNeural', name: 'Hoài My', desc: 'Nữ - Nhẹ nhàng', emoji: '👧' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('easyvoice_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // HÀM GỌI GIỌNG ĐỌC NGƯỜI THẬT (MICROSOFT EDGE TTS)
  const speakAzure = async () => {
    if (!text.trim() || isSpeaking) return;

    setIsSpeaking(true);

    try {
      // Sử dụng API lách của Microsoft Edge (Cực kỳ ổn định và giống người thật)
      const url = `https://api.vncool.com/api/tts?text=${encodeURIComponent(text)}&voice=${selectedVoice}&speed=${speed}&pitch=${pitch}`;
      
      const audio = new Audio(url);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        alert("Lỗi kết nối giọng đọc bro ơi!");
        setIsSpeaking(false);
      };
      audio.play();

      // Lưu lịch sử
      const newHistory = [text.trim(), ...history].slice(0, 6);
      setHistory(newHistory);
      localStorage.setItem('easyvoice_history', JSON.stringify(newHistory));

    } catch (error) {
      console.error(error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    window.location.reload(); // Cách nhanh nhất để dừng Audio đang stream
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-black text-white font-sans">
      {/* NỀN HÌNH ẢNH */}
      <div className="absolute inset-0 z-0 bg-fixed" style={{ backgroundImage: `url('https://files.catbox.moe/lovccc.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 z-0 bg-black/80 backdrop-blur-[1px]"></div>

      {/* SIDEBAR */}
      <aside className={cn("relative z-20 h-full bg-zinc-950/90 backdrop-blur-2xl border-r border-white/5 w-72 flex flex-col transition-all duration-300", !sidebarOpen && "-ml-72")}>
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><Headphones size={20} /></div>
          <div><h1 className="text-xl font-black italic tracking-tighter">EasyVoice</h1><p className="text-[10px] text-indigo-400 font-bold uppercase">Natural AI</p></div>
        </div>
        <div className="p-4 flex-1">
          <div className="px-4 py-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-sm font-bold text-indigo-300 flex items-center gap-2">
            <Mic2 size={16} /> Giọng Người Thật
          </div>
        </div>
      </aside>

      {/* CHÍNH */}
      <div className="flex-1 flex flex-col relative z-10">
        <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center px-8 justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-800 rounded-lg"><Menu size={24} /></button>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">Hệ thống sẵn sàng</span>
          </div>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* CỘT TRÁI */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Nhập nội dung để nghe giọng AI tự nhiên..."
                  className="w-full h-[420px] bg-transparent text-3xl lg:text-4xl text-zinc-100 placeholder:text-zinc-900 focus:outline-none resize-none leading-snug"
                />
                <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
                  <div className="flex-1 flex gap-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase flex items-center mr-2">Phát nhanh:</p>
                    {history.slice(0,3).map((h, i) => (
                      <button key={i} onClick={() => setText(h)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-bold text-zinc-400 truncate max-w-[100px]">{h}</button>
                    ))}
                  </div>
                  <button onClick={() => setText('')} className="p-3 text-zinc-600 hover:text-red-400 transition-all"><Trash2 size={24} /></button>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI */}
            <div className="lg:col-span-4 space-y-6">
              {/* CHỌN GIỌNG AI */}
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2rem] p-6 shadow-xl">
                <p className="text-[10px] font-bold uppercase text-zinc-500 mb-4 tracking-widest">Chọn nhân vật</p>
                <div className="grid grid-cols-1 gap-2">
                  {azureVoices.map(v => (
                    <button key={v.id} onClick={() => setSelectedVoice(v.id)} className={cn("flex items-center gap-4 p-4 rounded-2xl border transition-all text-left", selectedVoice === v.id ? "border-indigo-500 bg-indigo-600/30" : "border-white/5 bg-zinc-900 hover:bg-zinc-800")}>
                      <span className="text-3xl">{v.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{v.name}</p>
                        <p className="text-[10px] text-zinc-500">{v.desc}</p>
                      </div>
                      {selectedVoice === v.id && <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full"></div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* THANH TRƯỢT */}
              <div className="bg-zinc-950/90 border border-white/10 rounded-[2rem] p-6 space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest"><span>Tốc độ</span><span className="text-indigo-400 font-black">{speed}x</span></div>
                  <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full h-1 accent-indigo-500" />
                </div>
              </div>

              {/* NÚT PHÁT */}
              <button 
                onClick={isSpeaking ? stopSpeaking : speakAzure} 
                className={cn("w-full py-8 rounded-[2.5rem] text-2xl font-black flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95", isSpeaking ? "bg-red-600" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/40")}
              >
                {isSpeaking ? <><Square size={28} fill="currentColor" /> DỪNG PHÁT</> : <><Play size={28} fill="currentColor" /> PHÁT NGAY</>}
              </button>
              
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                 <p className="text-[10px] text-emerald-400 font-bold text-center leading-relaxed italic">"Đã kích hoạt giọng đọc Microsoft Azure Neural chất lượng cao"</p>
              </div>
            </div>

          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        input[type='range'] { -webkit-appearance: none; background: #18181b; height: 4px; border-radius: 2px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: #6366f1; border-radius: 50%; cursor: pointer; border: 2px solid #fff; }
      `}</style>
    </div>
  );
}