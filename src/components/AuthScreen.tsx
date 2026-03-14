import { useState } from 'react';
import { useData } from '@/lib/data';

interface AuthScreenProps {
  onAuth: () => void;
}

const AuthScreen = ({ onAuth }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, login } = useData();

  const handleSignup = () => {
    setError('');
    if (!name || !username || !password) { setError('All fields are required'); return; }
    if (password !== repeatPassword) { setError('Passwords do not match'); return; }
    if (!signup(name, username, password)) { setError('Username already taken'); return; }
    onAuth();
  };

  const handleLogin = () => {
    setError('');
    if (!username || !password) { setError('All fields are required'); return; }
    if (!login(username, password)) { setError('Invalid credentials'); return; }
    onAuth();
  };

  return (
    <div className="flex flex-col justify-center min-h-screen px-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-10 text-foreground">
        {isLogin ? 'Welcome Back' : 'Join EDO Club'}
      </h1>

      {error && (
        <p className="text-destructive text-sm text-center mb-4">{error}</p>
      )}

      {!isLogin && (
        <div className="mb-4">
          <label className="block text-sm text-muted-foreground mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-3 glass-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent edo-transition"
            placeholder="John Doe"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-muted-foreground mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-3 glass-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent edo-transition"
          placeholder="username"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-muted-foreground mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 glass-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent edo-transition"
          placeholder="••••••••"
        />
      </div>

      {!isLogin && (
        <div className="mb-4">
          <label className="block text-sm text-muted-foreground mb-1">Repeat Password</label>
          <input
            type="password"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            className="w-full p-3 glass-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent edo-transition"
            placeholder="••••••••"
          />
        </div>
      )}

      <button
        onClick={isLogin ? handleLogin : handleSignup}
        className="w-full py-3 mt-3 bg-foreground text-background font-bold uppercase tracking-widest edo-transition hover:opacity-90"
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>

      <p
        className="text-center mt-6 text-muted-foreground cursor-pointer hover:text-accent edo-transition"
        onClick={() => { setIsLogin(!isLogin); setError(''); }}
      >
        {isLogin ? "Don't have an account? Sign up here..." : 'Already have an account? Login here...'}
      </p>
    </div>
  );
};

export default AuthScreen;
