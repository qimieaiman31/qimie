/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Gamepad2, 
  PlayCircle, 
  LayoutDashboard, 
  MessageCircle, 
  ChevronRight, 
  Star, 
  Trophy,
  Volume2,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { FLASHCARDS, QUIZ_QUESTIONS, type Flashcard, type QuizQuestion } from './data/content';

// --- Types ---
type View = 'dashboard' | 'learn' | 'quiz' | 'media';

// --- Shared Components ---

const Sidebar = ({ currentView, setView }: { currentView: View, setView: (v: View) => void }) => {
  const items = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Utama', color: 'text-red-500' },
    { id: 'learn', icon: BookOpen, label: 'Belajar', color: 'text-green-500' },
    { id: 'quiz', icon: Gamepad2, label: 'Kuiz', color: 'text-purple-500' },
    { id: 'media', icon: PlayCircle, label: 'Media', color: 'text-yellow-500' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-[#141414] border-r border-white/10 z-50 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl">B</div>
        <span className="hidden md:block font-bold text-xl tracking-tight">Bijak Bahasa</span>
      </div>
      
      <nav className="flex-1 px-3 space-y-2 mt-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className={`w-6 h-6 ${currentView === item.id ? item.color : ''}`} />
            <span className="hidden md:block font-medium">{item.label}</span>
            {currentView === item.id && (
              <motion.div 
                layoutId="active-nav"
                className="ml-auto w-1 h-6 bg-red-600 rounded-full"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 hidden md:block">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl">
          <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Tahap Anda</p>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-bold">Jaguh Bahasa</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hai! Saya Cikgu AI. Ada apa-apa soalan tentang Kata Nama?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are Cikgu AI, a friendly Malay language tutor for Year 4 students. 
            Answer questions about Malay grammar, specifically Kata Nama Am and Kata Nama Khas.
            Keep explanations extremely simple, encouraging, and use emojis. 
            Supported languages: Malay (primary) and English.
            User said: ${userMsg}` }] }
        ],
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || 'Maaf, saya tidak faham. Boleh ulang?' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Alamak, saya ada masalah teknikal. Cuba lagi nanti ya!' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 bg-[#1f1f1f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-red-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="font-bold">Cikgu AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    m.role === 'user' ? 'bg-red-600 rounded-tr-none' : 'bg-white/10 rounded-tl-none'
                  }`}>
                    <p className="text-sm">{m.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-xs text-gray-400 animate-pulse">Cikgu AI sedang menulis...</div>}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanya sesuatu..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-600 transition-colors"
              />
              <button 
                onClick={handleSend}
                className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-red-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
};

// --- View Components ---

const Dashboard = ({ setView }: { setView: (v: View) => void }) => {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative h-[60vh] rounded-3xl overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="Classroom background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 bg-red-600 rounded-md text-xs font-bold mb-4 uppercase tracking-widest">Baru</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">Pengembaraan Kata Nama</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-md">Mari terokai dunia Kata Nama Am dan Kata Nama Khas bersama kawan-kawan baharu!</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setView('learn')}
                className="bg-white text-black px-8 py-3 rounded-md font-bold hover:bg-gray-200 flex items-center gap-2"
              >
                <PlayCircle className="w-5 h-5" /> Mula Belajar
              </button>
              <button 
                onClick={() => setView('quiz')}
                className="bg-white/20 backdrop-blur-md px-8 py-3 rounded-md font-bold hover:bg-white/30"
              >
                Main Kuiz
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Row Topics */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold">Topik Pembelajaran</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#1f1f1f] p-6 rounded-2xl border border-white/5 hover:border-green-500/50 transition-all cursor-pointer group">
            <h3 className="text-xl font-black mb-2 group-hover:text-green-500 transition-colors tracking-tight uppercase">KATA NAMA AM</h3>
            <p className="text-sm text-gray-400 mb-4">Belajar tentang benda, tempat, dan haiwan secara umum.</p>
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400" className="w-full h-40 object-cover rounded-xl mb-4" />
            <button onClick={() => setView('learn')} className="text-green-500 font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
              Buka <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-2xl border border-white/5 hover:border-purple-500/50 transition-all cursor-pointer group">
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-500 transition-colors">Misteri Kata Nama Khas</h3>
            <p className="text-sm text-gray-400 mb-4">Kenali nama-nama khusus untuk orang, tempat, dan hari.</p>
            <img src="https://images.unsplash.com/photo-1517502884422-41eaadeff175?auto=format&fit=crop&q=80&w=400" className="w-full h-40 object-cover rounded-xl mb-4" />
            <button onClick={() => setView('learn')} className="text-purple-500 font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
              Buka <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const LearnView = () => {
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);

  const handleSpeak = (text: string) => {
    speak(text);
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Kad Imbasan (Flashcards)</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-bold border border-green-500/30">Tahap 1</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {FLASHCARDS.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCard(card)}
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 border-transparent hover:border-red-600 transition-all"
          >
            <img src={card.imageUrl} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded w-fit mb-1 ${
                card.type === 'Am' ? 'bg-green-600' : 'bg-purple-600'
              }`}>
                {card.type === 'Am' ? 'Am' : 'Khas'}
              </span>
              <h3 className="font-bold text-lg">{card.word}</h3>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSpeak(card.word); }}
                className="absolute top-2 right-2 p-2 bg-black/40 rounded-full hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal / Card Details */}
      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCard(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              layoutId={selectedCard.id}
              className="relative bg-[#1f1f1f] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 aspect-square">
                  <img src={selectedCard.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div className="md:w-1/2 p-8 space-y-6">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                      selectedCard.type === 'Am' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-purple-500/20 text-purple-500 border border-purple-500/30'
                    }`}>
                      Kata Nama {selectedCard.type}
                    </span>
                    <h2 className="text-4xl font-bold mb-2">{selectedCard.word}</h2>
                    <p className="text-gray-400 leading-relaxed italic">"{selectedCard.meaning}"</p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Contoh Ayat</p>
                    <p className="text-lg leading-relaxed">{selectedCard.example}</p>
                  </div>

                  <button 
                    onClick={() => handleSpeak(selectedCard.word)}
                    className="w-full py-4 bg-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                  >
                    <Volume2 className="w-5 h-5" /> Dengar Sebutan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuizView = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'quiz' | 'game'>('quiz');

  const question = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    const correct = option === question.answer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 10);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(idx => idx + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex bg-[#1f1f1f] p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setMode('quiz')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'quiz' ? 'bg-red-600' : 'hover:bg-white/5'}`}
          >
            Latihan Kuiz
          </button>
          <button 
            onClick={() => setMode('game')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'game' ? 'bg-red-600' : 'hover:bg-white/5'}`}
          >
            Permainan Mini
          </button>
        </div>
        <div className="flex items-center gap-4 bg-[#1f1f1f] px-6 py-2 rounded-full border border-white/10">
          <div className="flex items-center gap-2 text-yellow-400">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>

      {mode === 'game' ? (
        <CategorizationGame />
      ) : !showResult ? (
        <motion.div
          key={currentQuestionIdx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1f1f1f] p-8 rounded-3xl border border-white/10 shadow-2xl"
        >
          <p className="text-2xl mb-8 font-medium">{question.question}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options?.map((opt) => (
              <button
                key={opt}
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswer(opt)}
                className={`p-6 rounded-2xl flex items-center gap-4 border-2 transition-all ${
                  selectedAnswer === opt
                    ? isCorrect 
                      ? 'bg-green-500/20 border-green-500' 
                      : 'bg-red-500/20 border-red-500'
                    : selectedAnswer && opt === question.answer
                      ? 'bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">
                  {opt.charAt(0)}
                </div>
                <span className="text-lg font-medium">{opt}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-white/5 rounded-2xl border-l-4 border-red-600"
              >
                <h4 className="font-bold text-red-500 mb-2">Penjelasan:</h4>
                <p className="text-gray-300">{question.explanation}</p>
                <button 
                  onClick={nextQuestion}
                  className="mt-6 w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  Seterusnya <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1f1f1f] p-12 rounded-3xl border border-white/10 text-center shadow-2xl"
        >
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(229,9,20,0.4)]">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 italic">Tahniah!</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto text-lg leading-relaxed">
            Anda telah melengkapkan arena kuiz! Terus berusaha untuk menjadi Jaguh Bahasa.
          </p>
          
          <div className="bg-white/5 rounded-2xl p-8 mb-8 border border-white/10 inline-block px-12">
            <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-2">Skor Akhir</p>
            <div className="text-6xl font-black text-red-500 italic">{score}</div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => {
                setCurrentQuestionIdx(0);
                setScore(0);
                setShowResult(false);
                setSelectedAnswer(null);
                setIsCorrect(null);
              }}
              className="px-8 py-3 bg-red-600 rounded-xl font-bold hover:bg-red-700 transition-all"
            >
              Cuba Lagi
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const MediaView = () => {
  const content = [
    { title: "Animasi Kata Nama Am", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400", duration: "3:45" },
    { title: "Lagu 'Nama Saya Siapa?'", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400", duration: "2:10" },
    { title: "Kisah Kembara Ahmad", img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=400", duration: "5:00" },
    { title: "Jom Cari Kata Nama", img: "https://images.unsplash.com/photo-1550592704-6c76defa9985?auto=format&fit=crop&q=80&w=400", duration: "4:20" },
  ];

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-6">Video & Lagu Rakyat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.map((c, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
                <img src={c.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 text-[10px] px-2 py-1 rounded font-bold">
                  {c.duration}
                </div>
              </div>
              <h3 className="font-bold group-hover:text-red-500 transition-colors">{c.title}</h3>
              <p className="text-xs text-gray-400">Unit 1: Kata Nama</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Poster Pembelajaran</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="aspect-[3/4] bg-[#1f1f1f] rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500"><BookOpen className="w-10 h-10" /></div>
             <h4 className="font-bold">Poster Kata Nama Am</h4>
             <button className="text-xs font-bold text-red-500 uppercase tracking-widest">Muat Turun PDF</button>
          </div>
          <div className="aspect-[3/4] bg-[#1f1f1f] rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500"><Sparkles className="w-10 h-10" /></div>
             <h4 className="font-bold">Poster Kata Nama Khas</h4>
             <button className="text-xs font-bold text-red-500 uppercase tracking-widest">Muat Turun PDF</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Categorization Game ---

const CategorizationGame = () => {
  const words = [
    { word: 'Kuala Lumpur', type: 'Khas' },
    { word: 'Sungai', type: 'Am' },
    { word: 'Cikgu Siti', type: 'Khas' },
    { word: 'Buku', type: 'Am' },
    { word: 'Zoo Negara', type: 'Khas' },
    { word: 'Kucing', type: 'Am' }
  ];

  const [items, setItems] = useState(words);
  const [bins, setBins] = useState<{Am: string[], Khas: string[]}>({ Am: [], Khas: [] });
  const [message, setMessage] = useState('');
  const [complete, setComplete] = useState(false);

  const drop = (type: 'Am' | 'Khas', word: string) => {
    const item = items.find(i => i.word === word);
    if (item?.type === type) {
      setBins(prev => ({ ...prev, [type]: [...prev[type], word] }));
      setItems(prev => prev.filter(i => i.word !== word));
      setMessage('Betul! 🎉');
      setTimeout(() => setMessage(''), 1000);
    } else {
      setMessage('Cuba lagi! ❌');
      setTimeout(() => setMessage(''), 1000);
    }
  };

  useEffect(() => {
    if (items.length === 0) setComplete(true);
  }, [items]);

  if (complete) {
    return (
      <div className="text-center py-20 bg-green-600/10 rounded-3xl border-2 border-dashed border-green-500">
        <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-4">Hebat! Anda Pakar Categorization!</h3>
        <button onClick={() => { setItems(words); setBins({ Am: [], Khas: [] }); setComplete(false); }} className="bg-white text-black px-6 py-2 rounded-lg font-bold">Main Lagi</button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Permainan Asingkan</h2>
        <p className="text-gray-400">Tarik perkataan ke kotak yang betul!</p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center py-8">
        {items.map((item) => (
          <motion.div
            key={item.word}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              // Simple check based on screen position - normally we'd use a real DnD lib
              // But for this environment, we can use a "click to assign" for better compatibility or simple distance
              // Let's use a "click to select" then "click to bin" approach or just buttons for robustness
            }}
            className="px-6 py-3 bg-[#1f1f1f] rounded-xl border border-white/20 cursor-grab active:cursor-grabbing font-bold text-lg shadow-xl"
          >
            {item.word}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 h-64">
        {['Am', 'Khas'].map((type) => (
          <div 
            key={type}
            className={`rounded-3xl border-2 border-dashed flex flex-col items-center p-6 transition-all ${
              type === 'Am' ? 'border-green-500/50 bg-green-500/5' : 'border-purple-500/50 bg-purple-500/5'
            }`}
          >
            <h4 className="font-bold text-xl mb-4">Kata Nama {type}</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {bins[type as 'Am' | 'Khas'].map(w => (
                <span key={w} className="px-3 py-1 bg-white/10 rounded-lg text-sm">{w}</span>
              ))}
            </div>
            {/* Overlay buttons for the "DnD" experience in a limited env */}
            <div className="mt-auto flex flex-wrap gap-2">
              {items.map(item => (
                <button 
                  key={item.word}
                  onClick={() => drop(type as 'Am' | 'Khas', item.word)}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] uppercase font-bold"
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {message && <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold pointer-events-none drop-shadow-lg">{message}</div>}
    </div>
  );
};

// --- Helper for Speech ---
const speak = (text: string) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ms-MY'; // Malay
  synth.speak(utterance);
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-600/30 overflow-x-hidden">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="ml-20 md:ml-64 min-h-screen p-6 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {currentView === 'dashboard' && <Dashboard setView={setCurrentView} />}
            {currentView === 'learn' && <LearnView />}
            {currentView === 'quiz' && <QuizView />}
            {currentView === 'media' && (
              <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center italic opacity-60">
                <PlayCircle className="w-16 h-16 mb-4" />
                <h2 className="text-4xl font-black">Media Akan Datang</h2>
                <p className="max-w-md">Kami sedang menyiapkan video animasi dan lagu rakyat untuk anda!</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Chatbot />
    </div>
  );
}

