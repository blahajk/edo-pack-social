import { useState } from 'react';
import { useData } from '@/lib/data';
import { Menu, X } from 'lucide-react';

interface AccountPageProps {
  onViewPost?: (postId: string) => void;
}

const COUPON_OPTIONS = [
  { type: '$5 EDO Voucher', cost: 500, amount: 5 },
  { type: '$10 EDO Voucher', cost: 1000, amount: 10 },
  { type: '$25 EDO Voucher', cost: 2500, amount: 25 },
];

const AccountPage = ({ onViewPost }: AccountPageProps) => {
  const { currentUser, getUserPosts, updateProfile, redeemCoupon, logout } = useData();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editUsername, setEditUsername] = useState(currentUser?.username || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [toast, setToast] = useState('');

  if (!currentUser) return null;

  const posts = getUserPosts(currentUser.username);
  const coupons = currentUser.coupons || [];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1500);
  };

  const handleSaveProfile = () => {
    updateProfile({ name: editName, username: editUsername, bio: editBio });
    setShowEditProfile(false);
    setShowSidebar(false);
  };

  const handleRedeem = (option: typeof COUPON_OPTIONS[0]) => {
    if (redeemCoupon(option.type, option.cost, option.amount)) {
      showToast(`Redeemed ${option.type}!`);
    }
  };

  const getCouponCount = (type: string) => {
    return coupons.find(c => c.type === type)?.count || 0;
  };

  return (
    <div className="animate-fade-in pb-24">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[2000] px-4 py-1.5 bg-yellow-400 text-black font-bold text-sm"
          style={{ animation: 'toast-in 0.3s ease-out' }}
        >
          {toast}
        </div>
      )}

      <div className="p-5">
        {/* Top */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl text-muted-foreground">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <button onClick={() => setShowSidebar(true)} className="text-foreground">
            <Menu size={24} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
        <p className="text-muted-foreground">@{currentUser.username}</p>
        {currentUser.bio && <p className="text-sm text-foreground mt-2">{currentUser.bio}</p>}

        {/* Stats */}
        <div className="flex gap-8 my-6">
          <div className="text-center">
            <span className="block text-xl font-bold text-foreground">{currentUser.followers}</span>
            <span className="text-xs text-muted-foreground">Followers</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-foreground">{posts.length}</span>
            <span className="text-xs text-muted-foreground">Posts</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-foreground">{currentUser.points}</span>
            <span className="text-xs text-muted-foreground">Points</span>
          </div>
        </div>

        <hr className="border-border my-4" />

        {/* Post Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-0.5">
            {posts.map(post => (
              <button
                key={post.id}
                onClick={() => onViewPost?.(post.id)}
                className="aspect-square glass-card flex items-center justify-center hover:opacity-80 edo-transition cursor-pointer"
              >
                <span className="text-xs text-muted-foreground text-center px-1">{post.caption.slice(0, 30)}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-12">No posts available</p>
        )}
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowSidebar(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-background border-l border-border z-50 p-5"
            style={{ animation: 'fade-in 0.2s ease-out' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-foreground">Settings</h3>
              <button onClick={() => setShowSidebar(false)} className="text-foreground"><X size={20} /></button>
            </div>
            <ul className="space-y-0">
              <li
                className="py-4 border-b border-border cursor-pointer text-foreground hover:text-accent edo-transition"
                onClick={() => { setShowEditProfile(true); setShowRedeem(false); }}
              >
                Edit Profile
              </li>
              <li
                className="py-4 border-b border-border cursor-pointer text-foreground hover:text-accent edo-transition"
                onClick={() => { setShowRedeem(true); setShowEditProfile(false); }}
              >
                Redeem Points
              </li>
              <li
                className="py-4 cursor-pointer text-destructive hover:opacity-80 edo-transition"
                onClick={logout}
              >
                Logout
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setShowEditProfile(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-background border border-border p-6 z-[60]"
            style={{ animation: 'fade-in 0.2s ease-out' }}
          >
            <h3 className="font-bold text-lg mb-4 text-foreground">Edit Profile</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full p-2 glass-card text-foreground focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Username</label>
                <input value={editUsername} onChange={e => setEditUsername(e.target.value)}
                  className="w-full p-2 glass-card text-foreground focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Biography</label>
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
                  className="w-full p-2 glass-card text-foreground focus:outline-none resize-none"
                  placeholder="Tell us about yourself..." />
              </div>
            </div>
            <button onClick={handleSaveProfile}
              className="w-full py-2 mt-4 bg-foreground text-background font-bold uppercase tracking-widest edo-transition hover:opacity-90">
              Save Changes
            </button>
          </div>
        </>
      )}

      {/* Redeem Modal */}
      {showRedeem && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setShowRedeem(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-background border border-border p-6 z-[60]"
            style={{ animation: 'fade-in 0.2s ease-out' }}
          >
            <h3 className="font-bold text-lg mb-4 text-foreground">Redeem Points</h3>
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-accent">{currentUser.points}</p>
              <p className="text-muted-foreground mt-2">Points Available</p>
            </div>
            <div className="space-y-3">
              {COUPON_OPTIONS.map(option => {
                const owned = getCouponCount(option.type);
                return (
                  <div key={option.type} className="glass-card p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-foreground text-sm">{option.type}</p>
                      <p className="text-xs text-muted-foreground">{option.cost} points</p>
                      {owned > 0 && (
                        <p className="text-xs text-accent mt-0.5">You have: {owned}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRedeem(option)}
                      disabled={currentUser.points < option.cost}
                      className="px-3 py-1 bg-foreground text-background text-xs font-bold disabled:opacity-30"
                    >
                      Redeem
                    </button>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowRedeem(false)}
              className="w-full py-2 mt-4 border border-border text-foreground font-bold uppercase tracking-widest edo-transition hover:opacity-70">
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountPage;
