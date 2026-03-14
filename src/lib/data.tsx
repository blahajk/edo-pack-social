import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Types
export interface Comment {
  id: string;
  username: string;
  text: string;
  likes: number;
}

export interface Post {
  id: string;
  authorUsername: string;
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: number;
  shares: number;
  comments: Comment[];
  hashtags: string[];
  createdAt: number;
}

export interface User {
  name: string;
  username: string;
  password: string;
  bio: string;
  profilePic: string;
  posts: string[]; // post IDs
  points: number;
  followers: number;
  following: string[];
  coupons: { type: string; amount: number; count: number }[];
}

interface EdoDB {
  users: User[];
  posts: Post[];
  currentUser: string | null; // username
}

interface DataContextType {
  db: EdoDB;
  currentUser: User | null;
  signup: (name: string, username: string, password: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addPost: (caption: string, mediaUrl: string, mediaType: 'image' | 'video', hashtags: string[]) => void;
  likePost: (postId: string) => void;
  sharePost: (postId: string) => void;
  commentOnPost: (postId: string, text: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  followUser: (username: string) => void;
  isFollowing: (username: string) => boolean;
  addPoints: (amount: number) => void;
  redeemCoupon: (type: string, cost: number, amount: number) => boolean;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'username' | 'bio' | 'profilePic'>>) => void;
  getPost: (postId: string) => Post | undefined;
  getUserPosts: (username: string) => Post[];
  getAllPosts: () => Post[];
}

const defaultDB: EdoDB = {
  users: [],
  posts: [],
  currentUser: null,
};

// Sample posts for demo
const samplePosts: Post[] = [
  { id: 'p1', authorUsername: 'edoofficial', caption: 'The crunch is real with these new seaweed crackers! 🌊', mediaUrl: '', mediaType: 'image', likes: 1243, shares: 89, comments: [{ id: 'c1', username: 'snackfan', text: 'These are amazing!', likes: 23 }], hashtags: ['CrispyLife', 'EDO'], createdAt: Date.now() - 86400000 },
  { id: 'p2', authorUsername: 'edoofficial', caption: 'New Potato Cracker Series is here! 🥔', mediaUrl: '', mediaType: 'image', likes: 2891, shares: 234, comments: [{ id: 'c2', username: 'foodlover', text: 'Can\'t wait to try!', likes: 45 }], hashtags: ['EDOMoment', 'NewSnack'], createdAt: Date.now() - 172800000 },
  { id: 'p3', authorUsername: 'snackreviewer', caption: 'Taste test: EDO Spicy Edition 🌶️🔥', mediaUrl: '', mediaType: 'video', likes: 567, shares: 45, comments: [], hashtags: ['SpicyEDO', 'SnackReview'], createdAt: Date.now() - 259200000 },
  { id: 'p4', authorUsername: 'officesnacker', caption: 'Office snack drawer essentials ft. EDO Pack', mediaUrl: '', mediaType: 'image', likes: 892, shares: 67, comments: [{ id: 'c3', username: 'worklife', text: 'My drawer looks the same 😂', likes: 12 }], hashtags: ['OfficeSnacks', 'EDOPack'], createdAt: Date.now() - 345600000 },
  { id: 'p5', authorUsername: 'foodvlogger', caption: 'Late night snack run with EDO 🌙', mediaUrl: '', mediaType: 'video', likes: 1567, shares: 123, comments: [{ id: 'c4', username: 'nightowl', text: 'Midnight munchies!', likes: 34 }], hashtags: ['SnackTime', 'MidnightSnack'], createdAt: Date.now() - 432000000 },
  { id: 'p6', authorUsername: 'edoofficial', caption: 'Pack your bags with EDO Pack! Travel edition ✈️', mediaUrl: '', mediaType: 'image', likes: 3421, shares: 456, comments: [], hashtags: ['TravelSnack', 'EDOPack'], createdAt: Date.now() - 518400000 },
];

const sampleUsers: User[] = [
  { name: 'EDO Official', username: 'edoofficial', password: '', bio: 'Official EDO Pack account', profilePic: '', posts: ['p1', 'p2', 'p6'], points: 0, followers: 15420, following: [], coupons: [] },
  { name: 'Snack Reviewer', username: 'snackreviewer', password: '', bio: 'Reviewing snacks daily', profilePic: '', posts: ['p3'], points: 0, followers: 892, following: [], coupons: [] },
  { name: 'Office Snacker', username: 'officesnacker', password: '', bio: '', profilePic: '', posts: ['p4'], points: 0, followers: 234, following: [], coupons: [] },
  { name: 'Food Vlogger', username: 'foodvlogger', password: '', bio: '', profilePic: '', posts: ['p5'], points: 0, followers: 5678, following: [], coupons: [] },
];

const DataContext = createContext<DataContextType | null>(null);

function loadDB(): EdoDB {
  try {
    const saved = localStorage.getItem('edo_db');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  // Initialize with sample data
  return {
    ...defaultDB,
    users: [...sampleUsers],
    posts: [...samplePosts],
  };
}

function saveDB(db: EdoDB) {
  localStorage.setItem('edo_db', JSON.stringify(db));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [db, setDB] = useState<EdoDB>(loadDB);

  useEffect(() => {
    saveDB(db);
  }, [db]);

  const currentUser = db.currentUser
    ? db.users.find(u => u.username === db.currentUser) || null
    : null;

  const signup = (name: string, username: string, password: string): boolean => {
    if (db.users.find(u => u.username === username)) return false;
    const newUser: User = {
      name, username, password, bio: '', profilePic: '',
      posts: [], points: 0, followers: 0, following: [], coupons: [],
    };
    setDB(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: username,
    }));
    return true;
  };

  const login = (username: string, password: string): boolean => {
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) return false;
    setDB(prev => ({ ...prev, currentUser: username }));
    return true;
  };

  const logout = () => setDB(prev => ({ ...prev, currentUser: null }));

  const addPost = (caption: string, mediaUrl: string, mediaType: 'image' | 'video', hashtags: string[]) => {
    if (!currentUser) return;
    const id = 'p' + Date.now();
    const post: Post = { id, authorUsername: currentUser.username, caption, mediaUrl, mediaType, likes: 0, shares: 0, comments: [], hashtags, createdAt: Date.now() };
    setDB(prev => ({
      ...prev,
      posts: [post, ...prev.posts],
      users: prev.users.map(u => u.username === currentUser.username ? { ...u, posts: [id, ...u.posts], points: u.points + 50 } : u),
    }));
  };

  const likePost = (postId: string) => {
    setDB(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p),
      users: prev.users.map(u => u.username === prev.currentUser ? { ...u, points: u.points + 5 } : u),
    }));
  };

  const sharePost = (postId: string) => {
    setDB(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === postId ? { ...p, shares: p.shares + 1 } : p),
      users: prev.users.map(u => u.username === prev.currentUser ? { ...u, points: u.points + 5 } : u),
    }));
  };

  const commentOnPost = (postId: string, text: string) => {
    if (!currentUser) return;
    const comment: Comment = { id: 'c' + Date.now(), username: currentUser.username, text, likes: 0 };
    setDB(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p),
      users: prev.users.map(u => u.username === prev.currentUser ? { ...u, points: u.points + 10 } : u),
    }));
  };

  const likeComment = (postId: string, commentId: string) => {
    setDB(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === postId ? { ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c) } : p),
    }));
  };

  const followUser = (username: string) => {
    if (!currentUser || currentUser.following.includes(username)) return;
    setDB(prev => ({
      ...prev,
      users: prev.users.map(u => {
        if (u.username === username) return { ...u, followers: u.followers + 1 };
        if (u.username === prev.currentUser) return { ...u, following: [...u.following, username], points: u.points + 5 };
        return u;
      }),
    }));
  };

  const isFollowing = (username: string) => {
    return currentUser?.following.includes(username) || false;
  };

  const redeemCoupon = (type: string, cost: number, amount: number): boolean => {
    if (!currentUser || currentUser.points < cost) return false;
    setDB(prev => ({
      ...prev,
      users: prev.users.map(u => {
        if (u.username !== prev.currentUser) return u;
        const coupons = [...(u.coupons || [])];
        const existing = coupons.find(c => c.type === type);
        if (existing) existing.count += 1;
        else coupons.push({ type, amount, count: 1 });
        return { ...u, points: u.points - cost, coupons };
      }),
    }));
    return true;
  };

  const addPoints = (amount: number) => {
    setDB(prev => ({
      ...prev,
      users: prev.users.map(u => u.username === prev.currentUser ? { ...u, points: u.points + amount } : u),
    }));
  };

  const updateProfile = (updates: Partial<Pick<User, 'name' | 'username' | 'bio' | 'profilePic'>>) => {
    if (!currentUser) return;
    const oldUsername = currentUser.username;
    setDB(prev => ({
      ...prev,
      currentUser: updates.username || prev.currentUser,
      users: prev.users.map(u => u.username === oldUsername ? { ...u, ...updates } : u),
      posts: updates.username ? prev.posts.map(p => p.authorUsername === oldUsername ? { ...p, authorUsername: updates.username! } : p) : prev.posts,
    }));
  };

  const getPost = (postId: string) => db.posts.find(p => p.id === postId);
  const getUserPosts = (username: string) => db.posts.filter(p => p.authorUsername === username);
  const getAllPosts = () => [...db.posts].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <DataContext.Provider value={{
      db, currentUser, signup, login, logout, addPost, likePost, sharePost,
      commentOnPost, likeComment, followUser, isFollowing, addPoints, redeemCoupon, updateProfile, getPost, getUserPosts, getAllPosts,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
