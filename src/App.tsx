import { useState } from 'react';
import { 
  MessageSquare, 
  Subtitles, 
  FolderOpen, 
  Mic2, 
  Library, 
  CreditCard, 
  Users, 
  Code, 
  Play, 
  Square, 
  Download, 
  Copy, 
  Trash2, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('tts');

  const voices = [
    { id: 'an-female', name: 'An', region: 'Miền Bắc', gender: 'Nữ', emoji: '👩', color: '#67e8f9' },
    { id: 'nam-male', name: 'Nam', region: 'Miền Bắc', gender: 'Nam', emoji: '👨', color: '#a78bfa' },
    { id: 'lan-female', name: 'Lan', region: 'Miền Nam', gender: 'Nữ', emoji: '👩', color: '#f472b6' },
    { id: 'hung-male', name: 'Hùng', region: 'Miền Nam', gender: 'Nam', emoji: '👨', color: '#34d399' },
    { id: 'mai-female', name: 'Mai', region: 'Miền Trung', gender: 'Nữ', emoji: '👩', color: '#fbbf24' },
  ];

  const sidebarItems = [
    { id: 'tts', icon: <MessageSquare size={20} />, label: 'Chuyển văn bản', tag: null },
    { id: 'sub', icon: <Subtitles size={20} />, label: 'Chuyển phụ đề', tag: null },
    { id: 'projects', icon: <FolderOpen size={20} />, label: 'Dự án', tag: 'Mới' },
    { id: 'clone', icon: <Mic2 size={20} />, label: 'Nhân bản giọng', tag: 'Mới' },
    { id: 'library', icon: <Library size={20} />, label: 'Thư viện giọng', tag: null },
    { id: 'billing', icon: <CreditCard size={20} />, label: 'Mua gói cước', tag: null },
    { id: 'referral', icon: <Users size={20} />, label: 'Giới thiệu bạn bè', tag: null, color: 'text-pink-500' },
    { id: 'api', icon: <Code size={20} />, label: 'Tích hợp API', tag: null },
    { id: 'deploy', icon: <Play size={20} className="text-green-500" />, label: 'Đưa website lên Internet', tag: 'HD' },
  ];

  const [showDeployGuide, setShowDeployGuide] = useState(false);

  const speedPresets = [0.75, 1, 1.25, 1.5, 2.0];

  const insertPause = (seconds: number) => {
    setText(prev => prev + `[pause=${seconds}s] `);
  };

  const speakWithPauses = (fullText: string) => {
    const parts = fullText.split(/(\[pause=\d+(\.\d+)?s\])/g).filter(p => p && !p.match(/^\d+(\.\d+)?$/));
    let i = 0;

    const speakNext = () => {
      if (i >= parts.length) { setIsSpeaking(false); return; }
      const part = parts[i].trim();
      i++;

      if (part.match(/^\[pause=(\d+(\.\d+)?)s\]$/)) {
        const sec = parseFloat(part.match(/[\d.]+/)?.[0] || '1');
        setTimeout(speakNext, sec * 1000);
      } else if (part) {
        const utterance = new SpeechSynthesisUtterance(part);
        utterance.rate = speed;
        utterance.pitch = pitch;
        utterance.volume = volume;
        utterance.lang = 'vi-VN';
        utterance.onend = speakNext;
        window.speechSynthesis.speak(utterance);
      } else {
        speakNext();
      }
    };

    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    speakNext();
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const currentVoice = voices.find(v => v.id === selectedVoice);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* Modal Hướng dẫn Triển khai */}
      {showDeployGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowDeployGuide(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-black text-[#1e1b4b] mb-6 flex items-center gap-3">
              🚀 Cách đưa website lên Internet (Miễn phí)
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Tải code về máy</h3>
                  <p className="text-slate-600">Sử dụng nút tải hoặc copy toàn bộ mã nguồn này vào project trên máy tính của bạn.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Đưa lên GitHub</h3>
                  <p className="text-slate-600">Tạo một Repository mới trên GitHub và tải toàn bộ code lên đó.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Kết nối với Vercel hoặc Netlify</h3>
                  <p className="text-slate-600">Đăng nhập vào <a href="https://vercel.com" target="_blank" className="text-blue-600 underline font-bold">Vercel.com</a>, chọn "Add New" {"->"} "Project" và chọn Repository GitHub của bạn. Nhấn <b>Deploy</b>!</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <p className="text-amber-800 text-sm">
                  <b>Lưu ý:</b> Sau khi Deploy xong, bạn sẽ nhận được một đường link (ví dụ: <code>my-voice-ai.vercel.app</code>) để gửi cho bất kỳ ai xem.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowDeployGuide(false)}
              className="mt-8 w-full py-4 bg-[#1e1b4b] text-white rounded-2xl font-bold hover:bg-[#2d2a5d] transition-colors"
            >
              Đã hiểu!
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white text-slate-900 w-64 flex flex-col transition-all duration-300 border-r border-slate-200 z-50",
          !sidebarOpen && "-ml-64"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1e1b4b] rounded-xl flex items-center justify-center text-[#fbbf24]">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <rect x="4" y="10" width="3" height="4" rx="1" />
              <rect x="9" y="6" width="3" height="12" rx="1" />
              <rect x="14" y="8" width="3" height="8" rx="1" />
              <rect x="19" y="11" width="3" height="2" rx="1" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1e1b4b] leading-tight">AIVoice</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider">by bee.ai</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
            onClick={() => {
              if (item.id === 'deploy') {
                setShowDeployGuide(true);
              } else {
                setActiveTab(item.id);
              }
            }}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold group",
                activeTab === item.id 
                  ? "bg-slate-100 text-[#1e1b4b]" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                item.color
              )}
            >
              <span className={cn(
                "transition-colors",
                activeTab === item.id ? "text-[#1e1b4b]" : "text-slate-400 group-hover:text-slate-600"
              )}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.tag && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {item.tag}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
          v2.4.0 • Studio Version
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/50 backdrop-blur-md bg-slate-950/50 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="h-5 w-[1px] bg-slate-800" />
            <span className="text-sm font-medium text-slate-300">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-cyan-400 tracking-tight">STUDIO MODE</span>
            </div>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Editor */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
                  {/* Editor Header */}
                  <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <MessageSquare size={16} />
                      </div>
                      <span className="font-bold text-slate-200">Nội dung văn bản</span>
                    </div>
                    <div className="text-xs font-medium text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
                      {text.length.toLocaleString()} / 5,000 ký tự
                    </div>
                  </div>

                  {/* Textarea */}
                  <div className="p-2">
                    <textarea
                      value={text}
                      onChange={e => setText(e.target.value)}
                      placeholder="Nhập văn bản tiếng Việt của bạn tại đây... [pause=1s] để tạo khoảng lặng."
                      className="w-full h-80 bg-transparent border-none focus:ring-0 text-slate-200 text-lg leading-relaxed placeholder:text-slate-600 resize-none p-4"
                    />
                  </div>

                  {/* Editor Footer Actions */}
                  <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigator.clipboard.writeText(text)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                      >
                        <Copy size={14} /> Sao chép
                      </button>
                      <button 
                        onClick={() => setText('')}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={14} /> Xóa hết
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 mr-1 uppercase tracking-wider">Chèn nghỉ:</span>
                      {[0.5, 1, 2].map(s => (
                        <button 
                          key={s} 
                          onClick={() => insertPause(s)}
                          className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Wave Visualizer */}
                {isSpeaking && (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-center gap-1.5 h-16">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full animate-wave" 
                        style={{ 
                          height: '20%',
                          animationDelay: `${i * 0.05}s`,
                          animationDuration: '0.8s'
                        }} 
                      />
                    ))}
                  </div>
                )}

                {/* Main Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <button
                    onClick={isSpeaking ? stopSpeaking : () => {
                      if (!text.trim()) return;
                      speakWithPauses(text);
                    }}
                    className={cn(
                      "sm:col-span-3 flex items-center justify-center gap-3 py-5 rounded-2xl text-lg font-black transition-all shadow-xl active:scale-95",
                      isSpeaking 
                        ? "bg-gradient-to-r from-red-500 to-orange-500 text-white" 
                        : "bg-gradient-to-r from-cyan-400 to-blue-600 text-white hover:shadow-cyan-500/20"
                    )}
                  >
                    {isSpeaking ? (
                      <><Square size={24} fill="currentColor" /> DỪNG PHÁT</>
                    ) : (
                      <><Play size={24} fill="currentColor" /> BẮT ĐẦU NGHE</>
                    )}
                  </button>
                  <button className="flex items-center justify-center gap-2 py-5 rounded-2xl bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 transition-all border border-slate-700 active:scale-95">
                    <Download size={24} /> <span className="sm:hidden lg:inline">TẢI MP3</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Settings */}
              <div className="lg:col-span-4 space-y-6">
                {/* Active Voice Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Mic2 size={80} />
                  </div>
                  <div className="relative flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl shadow-inner">
                      {currentVoice?.emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{currentVoice?.name}</h3>
                      <p className="text-slate-400 text-sm font-medium">{currentVoice?.gender} • {currentVoice?.region}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="px-3 py-1 rounded-full border border-cyan-500/50 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                        Active
                      </div>
                    </div>
                  </div>
                </div>

                {/* Voice Selection */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Danh sách giọng nói</h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {voices.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVoice(v.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group",
                          selectedVoice === v.id 
                            ? "bg-cyan-500/10 border-cyan-500/50" 
                            : "bg-slate-800/30 border-transparent hover:border-slate-700"
                        )}
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {v.emoji}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-200">{v.name}</p>
                          <p className="text-[11px] text-slate-500">{v.gender} • {v.region}</p>
                        </div>
                        {selectedVoice === v.id && (
                          <div className="ml-auto w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                            <ChevronRight size={14} className="text-slate-900" strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Tốc độ nhanh</h4>
                  <div className="flex flex-wrap gap-2">
                    {speedPresets.map(s => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={cn(
                          "px-4 py-2 rounded-xl font-bold text-xs transition-all border",
                          speed === s 
                            ? "bg-cyan-500 border-cyan-400 text-slate-950" 
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                        )}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fine Tuning */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Tinh chỉnh âm thanh</h4>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tốc độ (Speed)</label>
                        <span className="text-sm font-black text-cyan-400">{speed}x</span>
                      </div>
                      <input 
                        type="range" min="0.5" max="2" step="0.05" 
                        value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cao độ (Pitch)</label>
                        <span className="text-sm font-black text-purple-400">{pitch}</span>
                      </div>
                      <input 
                        type="range" min="0.5" max="2" step="0.05" 
                        value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Âm lượng (Volume)</label>
                        <span className="text-sm font-black text-pink-400">{Math.round(volume * 100)}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="1" step="0.05" 
                        value={volume} onChange={e => setVolume(parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
