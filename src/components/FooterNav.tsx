import { Home, PlayCircle, PlusSquare, User } from 'lucide-react';

type View = 'home' | 'video' | 'add' | 'account';

interface FooterNavProps {
  active: View;
  onNavigate: (view: View) => void;
}

const FooterNav = ({ active, onNavigate }: FooterNavProps) => {
  const items: { id: View; icon: typeof Home; label: string }[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'video', icon: PlayCircle, label: 'Videos' },
    { id: 'add', icon: PlusSquare, label: 'Post' },
    { id: 'account', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex justify-around py-3 border-t border-border z-50 backdrop-blur-xl"
      style={{ background: 'var(--footer-bg)' }}
    >
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1 edo-transition ${active === item.id ? 'text-accent' : 'text-foreground opacity-60 hover:opacity-100'}`}
        >
          <item.icon size={22} />
          <span className="text-[10px]">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default FooterNav;
