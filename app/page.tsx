'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Globe, LogIn, X, Settings, Music, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Translations
const t = {
  en: {
    appTitle: "Rakiz",
    focus: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    takePrayerBreak: "Take Prayer Break",
    continueWork: "Continue Work",
    prayerTimes: "Prayer Times",
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    hurryToPrayer: "حي على الصلاة! حي على الفلاح!",
    hurrySub: "Hurry to prayer! Hurry to success!",
    sounds: "Focus Sounds",
    rain: "Rain",
    library: "Library",
    nature: "Nature",
    analytics: "Analytics",
    totalFocus: "Total Focus Time Today",
    signIn: "Sign In",
    email: "Email",
    password: "Password",
    login: "Login",
    minutes: "minutes",
    warning: "10 minutes until next prayer!",
    settings: "Settings",
    save: "Save",
    close: "Close",
    focusDuration: "Focus Duration (min)",
    shortBreakDuration: "Short Break (min)",
    longBreakDuration: "Long Break (min)"
  },
  ar: {
    appTitle: "ركز",
    focus: "تركيز",
    shortBreak: "استراحة قصيرة",
    longBreak: "استراحة طويلة",
    start: "ابدأ",
    pause: "إيقاف مؤقت",
    reset: "إعادة ضبط",
    takePrayerBreak: "استراحة الصلاة",
    continueWork: "متابعة العمل",
    prayerTimes: "أوقات الصلاة",
    fajr: "الفجر",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    hurryToPrayer: "حي على الصلاة! حي على الفلاح!",
    hurrySub: "أقبل على الصلاة! أقبل على الفلاح!",
    sounds: "أصوات التركيز",
    rain: "مطر",
    library: "مكتبة",
    nature: "طبيعة",
    analytics: "الإحصائيات",
    totalFocus: "إجمالي وقت التركيز اليوم",
    signIn: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "دخول",
    minutes: "دقائق",
    warning: "10 دقائق حتى الصلاة القادمة!",
    settings: "الإعدادات",
    save: "حفظ",
    close: "إغلاق",
    focusDuration: "مدة التركيز (دقيقة)",
    shortBreakDuration: "استراحة قصيرة (دقيقة)",
    longBreakDuration: "استراحة طويلة (دقيقة)"
  }
};

// Mock Data
const PRAYER_TIMES = [
  { name: 'fajr', time: '05:30 AM' },
  { name: 'dhuhr', time: '12:15 PM' },
  { name: 'asr', time: '03:45 PM' },
  { name: 'maghrib', time: '06:20 PM' },
  { name: 'isha', time: '07:50 PM' },
];

const ANALYTICS_DATA = [
  { day: 'Mon', minutes: 120 },
  { day: 'Tue', minutes: 150 },
  { day: 'Wed', minutes: 90 },
  { day: 'Thu', minutes: 180 },
  { day: 'Fri', minutes: 60 },
  { day: 'Sat', minutes: 210 },
  { day: 'Sun', minutes: 140 },
];

const SOUND_ILLUSTRATIONS = [
  { id: 'rain', img: 'https://picsum.photos/seed/rain/400/300' },
  { id: 'library', img: 'https://picsum.photos/seed/library/400/300' },
  { id: 'nature', img: 'https://picsum.photos/seed/nature/400/300' }
];

export default function RakizApp() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isAuth, setIsAuth] = useState(false);
  
  const [modesConfig, setModesConfig] = useState({ focus: 25, shortBreak: 5, longBreak: 15 });
  const [activeMode, setActiveMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(modesConfig.focus * 60);
  
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [isPrayerBreak, setIsPrayerBreak] = useState(false);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(true); // Mock warning for demo
  
  const [activeModal, setActiveModal] = useState<'sounds' | 'analytics' | 'settings' | null>(null);
  const [tempConfig, setTempConfig] = useState(modesConfig);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isRTL = lang === 'ar';
  const text = t[lang];

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const handleTimerComplete = React.useCallback(() => {
    setIsActive(false);
    if (activeMode === 'focus') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      if (newCycles % 4 === 0) {
        setActiveMode('longBreak');
        setTimeLeft(modesConfig.longBreak * 60);
      } else {
        setActiveMode('shortBreak');
        setTimeLeft(modesConfig.shortBreak * 60);
      }
    } else {
      setActiveMode('focus');
      setTimeLeft(modesConfig.focus * 60);
    }
  }, [cycles, activeMode, modesConfig]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimeout(() => handleTimerComplete(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, handleTimerComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modesConfig[activeMode] * 60);
  };

  const changeMode = (newModeId: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setActiveMode(newModeId);
    setTimeLeft(modesConfig[newModeId] * 60);
  };

  const handlePrayerBreak = () => {
    setIsActive(false);
    setIsPrayerBreak(true);
  };

  const saveSettings = () => {
    setModesConfig(tempConfig);
    setTimeLeft(tempConfig[activeMode] * 60);
    setActiveModal(null);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSeconds = modesConfig[activeMode] * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Render Auth
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rakiz-bg islamic-pattern font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-rakiz-mint/50 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif text-rakiz-dark mb-2">{text.appTitle}</h1>
            <p className="text-rakiz-text/70">A minimalist Pomodoro for Muslims</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsAuth(true); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-rakiz-dark mb-1">{text.email}</label>
              <input type="email" required className="w-full px-4 py-2 rounded-xl border border-rakiz-mint focus:outline-none focus:ring-2 focus:ring-rakiz-peach bg-rakiz-bg/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-rakiz-dark mb-1">{text.password}</label>
              <input type="password" required className="w-full px-4 py-2 rounded-xl border border-rakiz-mint focus:outline-none focus:ring-2 focus:ring-rakiz-peach bg-rakiz-bg/50" />
            </div>
            <button type="submit" className="w-full py-3 bg-rakiz-dark text-white rounded-xl hover:bg-rakiz-dark/90 transition-colors font-medium">
              {text.login}
            </button>
          </form>
          <div className="mt-6 flex justify-center">
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="flex items-center gap-2 text-sm text-rakiz-text hover:text-rakiz-dark">
              <Globe size={16} /> {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-y-auto lg:overflow-hidden bg-rakiz-bg islamic-pattern text-rakiz-text font-sans transition-colors duration-500 relative" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Prayer Break Overlay */}
      {isPrayerBreak && (
        <div className="fixed inset-0 z-50 bg-rakiz-dark/95 flex flex-col items-center justify-center text-white backdrop-blur-sm animate-in fade-in duration-500">
          <h2 className="text-5xl md:text-7xl font-arabic font-bold mb-6 text-rakiz-peach text-center leading-tight">
            {text.hurryToPrayer}
          </h2>
          <p className="text-xl md:text-2xl font-serif text-rakiz-mint mb-12 opacity-90">
            {text.hurrySub}
          </p>
          <button 
            onClick={() => setIsPrayerBreak(false)}
            className="px-8 py-4 bg-rakiz-peach text-rakiz-dark rounded-full font-medium hover:bg-white transition-colors text-lg"
          >
            {text.continueWork}
          </button>
        </div>
      )}

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-rakiz-dark/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-lg shadow-xl relative animate-in zoom-in-95 duration-200 border border-rakiz-mint">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-rakiz-text hover:text-rakiz-dark transition-colors">
              <X size={24} />
            </button>
            
            {activeModal === 'sounds' && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-rakiz-dark mb-6 flex items-center gap-2">
                  <Music size={24} /> {text.sounds}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {SOUND_ILLUSTRATIONS.map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => setActiveSound(activeSound === sound.id ? null : sound.id)}
                      className={cn(
                        "relative overflow-hidden rounded-2xl aspect-square group transition-all",
                        activeSound === sound.id ? "ring-4 ring-rakiz-peach shadow-lg scale-105" : "hover:scale-105 hover:shadow-md"
                      )}
                    >
                      <Image src={sound.img} alt={sound.id} fill className="object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-rakiz-dark/80 to-transparent flex items-end p-4">
                        <span className="text-white font-medium capitalize">{text[sound.id as keyof typeof text] || sound.id}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'analytics' && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-rakiz-dark mb-6 flex items-center gap-2">
                  <BarChart2 size={24} /> {text.analytics}
                </h2>
                <div className="mb-6">
                  <p className="text-sm text-rakiz-text/70 mb-1">{text.totalFocus}</p>
                  <p className="text-4xl font-serif font-bold text-rakiz-dark">150 <span className="text-lg font-sans font-normal text-rakiz-text/70">{text.minutes}</span></p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ANALYTICS_DATA}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4A4A4A' }} />
                      <Tooltip cursor={{ fill: '#E8F3E8' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="minutes" fill="#2C3E2C" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeModal === 'settings' && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-rakiz-dark mb-6 flex items-center gap-2">
                  <Settings size={24} /> {text.settings}
                </h2>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-rakiz-dark mb-1">{text.focusDuration}</label>
                    <input type="number" min="5" max="120" step="5" value={tempConfig.focus} onChange={(e) => setTempConfig({...tempConfig, focus: parseInt(e.target.value) || 5})} className="w-full px-4 py-2 rounded-xl border border-rakiz-mint focus:outline-none focus:ring-2 focus:ring-rakiz-peach bg-rakiz-bg/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-rakiz-dark mb-1">{text.shortBreakDuration}</label>
                    <input type="number" min="5" max="30" step="5" value={tempConfig.shortBreak} onChange={(e) => setTempConfig({...tempConfig, shortBreak: parseInt(e.target.value) || 5})} className="w-full px-4 py-2 rounded-xl border border-rakiz-mint focus:outline-none focus:ring-2 focus:ring-rakiz-peach bg-rakiz-bg/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-rakiz-dark mb-1">{text.longBreakDuration}</label>
                    <input type="number" min="5" max="60" step="5" value={tempConfig.longBreak} onChange={(e) => setTempConfig({...tempConfig, longBreak: parseInt(e.target.value) || 5})} className="w-full px-4 py-2 rounded-xl border border-rakiz-mint focus:outline-none focus:ring-2 focus:ring-rakiz-peach bg-rakiz-bg/50" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setActiveModal(null)} className="px-6 py-2 rounded-xl font-medium text-rakiz-text hover:bg-rakiz-bg transition-colors">{text.close}</button>
                  <button onClick={saveSettings} className="px-6 py-2 rounded-xl font-medium bg-rakiz-dark text-white hover:bg-rakiz-dark/90 transition-colors">{text.save}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex-none flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-serif font-bold text-rakiz-dark">{text.appTitle}</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="p-2 rounded-full hover:bg-rakiz-mint/50 transition-colors" title="Toggle Language">
            <Globe size={20} />
          </button>
          <button onClick={() => setIsAuth(false)} className="p-2 rounded-full hover:bg-rakiz-mint/50 transition-colors" title="Logout">
            <LogIn size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-0">
        
        {/* Left Sidebar - Prayer Times */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white/80 backdrop-blur rounded-[2rem] p-6 shadow-sm border border-rakiz-mint">
            <h3 className="font-serif text-xl font-semibold text-rakiz-dark mb-4">{text.prayerTimes}</h3>
            
            {showWarning && (
              <div className="mb-4 p-3 bg-rakiz-peach/30 border border-rakiz-peach text-rakiz-dark rounded-xl text-sm font-medium flex items-start gap-2 animate-pulse">
                <span className="mt-0.5">⚠️</span>
                <span>{text.warning}</span>
              </div>
            )}

            <ul className="space-y-3">
              {PRAYER_TIMES.map((prayer, idx) => (
                <li key={prayer.name} className={cn(
                  "flex justify-between items-center p-3 rounded-xl transition-colors",
                  idx === 1 ? "bg-rakiz-mint text-rakiz-dark font-medium" : "hover:bg-rakiz-bg"
                )}>
                  <span className="capitalize">{text[prayer.name as keyof typeof text] || prayer.name}</span>
                  <span className="font-mono text-sm">{prayer.time}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={handlePrayerBreak}
              className="w-full mt-6 py-3 bg-rakiz-dark text-white rounded-xl hover:bg-rakiz-dark/90 transition-colors font-medium"
            >
              {text.takePrayerBreak}
            </button>
          </div>
        </aside>

        {/* Center - Timer */}
        <section className="lg:col-span-6 flex flex-col items-center justify-center">
          {/* Mode Selector */}
          <div className="flex bg-white/50 backdrop-blur p-1.5 rounded-full mb-12 shadow-sm border border-rakiz-mint">
            {(['focus', 'shortBreak', 'longBreak'] as const).map((m) => (
              <button
                key={m}
                onClick={() => changeMode(m)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  activeMode === m ? "bg-rakiz-dark text-white shadow-md" : "text-rakiz-text hover:bg-rakiz-mint/50"
                )}
              >
                {text[m]}
              </button>
            ))}
          </div>

          {/* Circular Timer */}
          <div className="relative flex items-center justify-center mb-12">
            <svg className="w-72 h-72 transform -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="136"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-rakiz-mint"
              />
              <circle
                cx="144"
                cy="144"
                r="136"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={136 * 2 * Math.PI}
                strokeDashoffset={(136 * 2 * Math.PI) - ((progress / 100) * (136 * 2 * Math.PI))}
                className="text-rakiz-dark transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-6xl font-serif font-bold text-rakiz-dark tracking-tighter">
                {formatTime(timeLeft)}
              </span>
              <span className="text-rakiz-text/70 mt-2 font-medium">
                {activeMode === 'focus' ? `Cycle ${cycles % 4 + 1}/4` : 'Break Time'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTimer}
              className="w-20 h-20 flex items-center justify-center bg-rakiz-peach text-rakiz-dark rounded-full shadow-md hover:scale-105 transition-transform"
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className={isRTL ? 'rotate-180' : 'ml-2'} />}
            </button>
            <button 
              onClick={resetTimer}
              className="w-12 h-12 flex items-center justify-center bg-white text-rakiz-text rounded-full shadow-sm border border-rakiz-mint hover:bg-rakiz-bg transition-colors"
              title={text.reset}
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </section>

        {/* Right Sidebar - Actions */}
        <aside className="lg:col-span-3 flex flex-row lg:flex-col gap-6 items-center justify-center lg:justify-end lg:items-end">
          <button 
            onClick={() => setActiveModal('sounds')}
            className="p-4 bg-white/80 backdrop-blur rounded-full shadow-sm border border-rakiz-mint hover:bg-rakiz-peach transition-colors group relative"
            title={text.sounds}
          >
            <Music className="text-rakiz-dark" size={28} />
            {activeSound && <span className="absolute top-0 right-0 w-3 h-3 bg-rakiz-dark rounded-full border-2 border-white"></span>}
          </button>

          <button 
            onClick={() => setActiveModal('analytics')}
            className="p-4 bg-white/80 backdrop-blur rounded-full shadow-sm border border-rakiz-mint hover:bg-rakiz-mint transition-colors"
            title={text.analytics}
          >
            <BarChart2 className="text-rakiz-dark" size={28} />
          </button>

          <button 
            onClick={() => { setTempConfig(modesConfig); setActiveModal('settings'); }}
            className="p-4 bg-white/80 backdrop-blur rounded-full shadow-sm border border-rakiz-mint hover:bg-white transition-colors"
            title={text.settings}
          >
            <Settings className="text-rakiz-dark" size={28} />
          </button>
        </aside>

      </main>
    </div>
  );
}
