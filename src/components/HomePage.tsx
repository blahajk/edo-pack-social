import { useData } from '@/lib/data';
import edoLogo from '@/assets/edo-logo.png';

interface HomePageProps {
  onHashtagClick: (hashtag: string) => void;
  onToggleTheme: () => void;
}

const trendingTags = [
  { tag: '#CrispyLife', gradient: 'from-blue-600 to-blue-800' },
  { tag: '#EDOMoment', gradient: 'from-indigo-600 to-purple-800' },
  { tag: '#SnackTime', gradient: 'from-amber-600 to-orange-800' },
  { tag: '#SpicyEDO', gradient: 'from-red-600 to-rose-800' },
  { tag: '#OfficeSnacks', gradient: 'from-emerald-600 to-teal-800' },
  { tag: '#EDOPack', gradient: 'from-cyan-600 to-blue-800' },
];

const HomePage = ({ onHashtagClick, onToggleTheme }: HomePageProps) => {
  const { currentUser } = useData();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center px-5 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <img src={edoLogo} alt="EDO Pack" className="h-8 mr-3" />
        <span className="font-bold text-foreground">@{currentUser?.username}</span>
        <button
          onClick={onToggleTheme}
          className="ml-auto text-foreground hover:text-accent edo-transition"
          aria-label="Toggle theme"
        >
          ☀
        </button>
      </div>

      <div className="p-4 pb-24">
        {/* Announcement */}
        <div className="glass-card p-6 mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Official Announcement</p>
          <h2 className="text-xl font-bold text-foreground">New Potato Cracker Series Out Now!</h2>
          <p className="text-sm text-muted-foreground mt-2">Experience the ultimate crunch with our latest flavors. Available in stores nationwide.</p>
        </div>

        {/* Trending */}
        <h3 className="text-lg font-bold mb-4 text-foreground">Trending #EDO</h3>
        <div className="grid grid-cols-2 gap-3">
          {trendingTags.map(({ tag, gradient }) => (
            <button
              key={tag}
              onClick={() => onHashtagClick(tag.replace('#', ''))}
              className={`aspect-[9/14] bg-gradient-to-br ${gradient} flex items-end p-3 edo-transition hover:scale-[1.02] active:scale-95`}
            >
              <span className="text-sm font-bold text-white drop-shadow-lg">{tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
