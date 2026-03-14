import { useState } from 'react';
import { Heart, MessageCircle, Share2, Play } from 'lucide-react';
import { useData, Post } from '@/lib/data';

interface VideoPageProps {
  hashtag?: string;
}

const VideoPage = ({ hashtag }: VideoPageProps) => {
  const { getAllPosts, likePost, sharePost, commentOnPost, followUser, currentUser } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [toast, setToast] = useState('');

  const posts = hashtag
    ? getAllPosts().filter(p => p.hashtags.some(h => h.toLowerCase() === hashtag.toLowerCase()))
    : getAllPosts();

  const post: Post | undefined = posts[currentIndex];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1200);
  };

  const handleLike = () => {
    if (!post) return;
    likePost(post.id);
    showToast('+5 Points!');
  };

  const handleShare = () => {
    if (!post) return;
    sharePost(post.id);
    showToast('+5 Points!');
  };

  const handleComment = () => {
    if (!post || !commentText.trim()) return;
    commentOnPost(post.id, commentText.trim());
    setCommentText('');
    showToast('+10 Points!');
  };

  const handleFollow = () => {
    if (!post) return;
    followUser(post.authorUsername);
    showToast('+5 Points!');
  };

  const handleSwipe = () => {
    if (currentIndex < posts.length - 1) setCurrentIndex(prev => prev + 1);
    else setCurrentIndex(0);
  };

  if (!post) {
    return (
      <div className="h-[calc(100vh-70px)] flex items-center justify-center text-muted-foreground">
        <p>No videos available{hashtag ? ` for #${hashtag}` : ''}</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-70px)] bg-black overflow-hidden" onClick={handleSwipe}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[2000] px-4 py-1.5 bg-yellow-400 text-black font-bold text-sm"
          style={{ animation: 'toast-in 0.3s ease-out' }}
        >
          {toast}
        </div>
      )}

      {/* Video placeholder */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-white/30">
          <Play size={64} className="mx-auto mb-2" />
          <p className="text-sm">Tap to next</p>
        </div>
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-40 flex flex-col gap-5 items-center z-10" onClick={e => e.stopPropagation()}>
        <button onClick={handleLike} className="text-center text-white edo-transition hover:scale-110 active:scale-90">
          <Heart size={28} className="mx-auto" />
          <span className="text-xs mt-1 block">{post.likes.toLocaleString()}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="text-center text-white edo-transition hover:scale-110">
          <MessageCircle size={28} className="mx-auto" />
          <span className="text-xs mt-1 block">{post.comments.length}</span>
        </button>
        <button onClick={handleShare} className="text-center text-white edo-transition hover:scale-110 active:scale-90">
          <Share2 size={28} className="mx-auto" />
          <span className="text-xs mt-1 block">{post.shares}</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-20 left-4 right-20 z-10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-white/20" />
          <span className="font-bold text-white">@{post.authorUsername}</span>
          {post.authorUsername !== currentUser?.username && (
            <button onClick={handleFollow} className="border border-white/50 text-white text-xs px-2 py-0.5 hover:bg-white/10 edo-transition">
              Follow
            </button>
          )}
        </div>
        <p className="text-white text-sm">{post.caption}</p>
        <p className="text-white/60 text-xs mt-1">
          {post.hashtags.map(h => `#${h}`).join(' ')}
        </p>
      </div>

      {/* Comments overlay */}
      {showComments && (
        <div className="absolute bottom-20 left-0 right-0 max-h-[50vh] bg-black/80 backdrop-blur-md z-20 p-4 overflow-y-auto"
          onClick={e => e.stopPropagation()}
          style={{ animation: 'slide-up 0.3s ease-out' }}
        >
          <h3 className="text-white font-bold mb-3">Comments</h3>
          {post.comments.length === 0 && <p className="text-white/50 text-sm">No comments yet</p>}
          {post.comments.map(c => (
            <div key={c.id} className="mb-3 text-white">
              <span className="font-bold text-sm">@{c.username}</span>
              <p className="text-sm text-white/80">{c.text}</p>
              <span className="text-xs text-white/40">{c.likes} likes</span>
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/10 text-white p-2 text-sm placeholder:text-white/40 focus:outline-none"
              onKeyDown={e => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment} className="text-accent text-sm font-bold px-3">Post</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;
