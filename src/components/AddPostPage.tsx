import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useData } from '@/lib/data';

interface AddPostPageProps {
  onPosted: () => void;
}

const AddPostPage = ({ onPosted }: AddPostPageProps) => {
  const { addPost } = useData();
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [toast, setToast] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith('video') ? 'video' : 'image';
    setMediaType(type);
    const reader = new FileReader();
    reader.onload = () => setMediaPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!caption.trim()) return;
    const tags = hashtags.split(/[#,\s]+/).filter(Boolean);
    addPost(caption, mediaPreview || '', mediaType, tags);
    setToast('+50 Points! Post created!');
    setTimeout(() => {
      setToast('');
      setCaption('');
      setHashtags('');
      setMediaPreview(null);
      onPosted();
    }, 1200);
  };

  return (
    <div className="p-5 pb-24 animate-fade-in">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[2000] px-4 py-1.5 bg-yellow-400 text-black font-bold text-sm"
          style={{ animation: 'toast-in 0.3s ease-out' }}
        >
          {toast}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-foreground">Create Post</h2>

      {/* Upload area */}
      <input type="file" ref={fileRef} accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full aspect-video glass-card flex flex-col items-center justify-center mb-5 edo-transition hover:opacity-80"
      >
        {mediaPreview ? (
          mediaType === 'video' ? (
            <video src={mediaPreview} className="w-full h-full object-cover" />
          ) : (
            <img src={mediaPreview} className="w-full h-full object-cover" alt="Preview" />
          )
        ) : (
          <>
            <Upload size={32} className="text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">Upload Media</p>
          </>
        )}
      </button>

      <textarea
        value={caption}
        onChange={e => setCaption(e.target.value)}
        rows={4}
        placeholder="Write a caption..."
        className="w-full p-3 glass-card text-foreground placeholder:text-muted-foreground focus:outline-none mb-3 resize-none"
      />

      <input
        value={hashtags}
        onChange={e => setHashtags(e.target.value)}
        placeholder="#hashtags (separated by spaces)"
        className="w-full p-3 glass-card text-foreground placeholder:text-muted-foreground focus:outline-none mb-5"
      />

      <button
        onClick={handlePost}
        disabled={!caption.trim()}
        className="w-full py-3 bg-foreground text-background font-bold uppercase tracking-widest edo-transition hover:opacity-90 disabled:opacity-30"
      >
        Post (+50 Points)
      </button>
    </div>
  );
};

export default AddPostPage;
