import { useState, useCallback } from 'react';
import { DataProvider, useData } from '@/lib/data';
import SplashScreen from '@/components/SplashScreen';
import AuthScreen from '@/components/AuthScreen';
import FooterNav from '@/components/FooterNav';
import HomePage from '@/components/HomePage';
import VideoPage from '@/components/VideoPage';
import AccountPage from '@/components/AccountPage';
import AddPostPage from '@/components/AddPostPage';

type View = 'home' | 'video' | 'add' | 'account';

const AppContent = () => {
  const { currentUser } = useData();
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<View>('home');
  const [videoHashtag, setVideoHashtag] = useState<string | undefined>();
  const [videoPostId, setVideoPostId] = useState<string | undefined>();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  const handleHashtagClick = (hashtag: string) => {
    setVideoHashtag(hashtag);
    setView('video');
  };

  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;

  if (!currentUser) {
    return <div className="max-w-[430px] mx-auto min-h-screen"><AuthScreen onAuth={() => {}} /></div>;
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen relative">
      {view === 'home' && <HomePage onHashtagClick={handleHashtagClick} onToggleTheme={toggleTheme} />}
      {view === 'video' && <VideoPage hashtag={videoHashtag} />}
      {view === 'add' && <AddPostPage onPosted={() => setView('home')} />}
      {view === 'account' && <AccountPage />}
      <FooterNav active={view} onNavigate={(v) => { setView(v); if (v !== 'video') setVideoHashtag(undefined); }} />
    </div>
  );
};

const Index = () => (
  <DataProvider>
    <AppContent />
  </DataProvider>
);

export default Index;
