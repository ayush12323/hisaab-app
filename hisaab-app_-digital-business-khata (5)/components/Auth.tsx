
import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, User as UserIcon, LogIn, Github, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onAuthComplete: (user: User) => void;
}

interface StoredUser {
  email: string;
  password: string;
  name: string;
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Mock database in localStorage
  const getStoredUsers = (): StoredUser[] => {
    const users = localStorage.getItem('hisaab_mock_db');
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (user: StoredUser) => {
    const users = getStoredUsers();
    users.push(user);
    localStorage.setItem('hisaab_mock_db', JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getStoredUsers();

    if (mode === 'register') {
      // Registration Logic
      const exists = users.find(u => u.email === email);
      if (exists) {
        setError('User with this Email ID already exists!');
        return;
      }
      
      const newUser = { email, password, name: name || 'Business Owner' };
      saveUser(newUser);
      onAuthComplete({ email: newUser.email, name: newUser.name });
    } else {
      // Login Logic
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onAuthComplete({ email: user.email, name: user.name });
      } else {
        // Fallback for demo purposes if DB is empty, allow a default login or show error
        if (users.length === 0 && email === 'admin@hisaab.com' && password === 'admin') {
           onAuthComplete({ email: 'admin@hisaab.com', name: 'Admin User' });
           return;
        }
        setError('Invalid Email ID or Password. Please Register first!');
      }
    }
  };

  const handleGoogleMock = () => {
    onAuthComplete({ email: 'google.user@gmail.com', name: 'Google User' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-8 max-w-md mx-auto relative overflow-hidden animate-fade-in">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full -mr-40 -mt-40 -z-10 animate-pulse"></div>
      
      <div className="mt-16 mb-auto space-y-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            {mode === 'login' ? 'Welcome' : 'Create'} <br />
            <span className="text-blue-600">Account</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {mode === 'login' ? 'Sign in to manage your digital khata' : 'Join thousands of smart shop owners'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 animate-bounce">
            <AlertCircle size={20} />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {mode === 'register' && (
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="text"
                required
                placeholder="Full Name (Business Owner)"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              type="email"
              required
              placeholder="Email ID / Mail Address"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              type="password"
              required
              placeholder="Secret Password"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group active:scale-95 transition-all mt-4"
          >
            {mode === 'login' ? 'LOGIN NOW' : 'CREATE FREE ACCOUNT'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="relative flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR USE SOCIAL</span>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button 
            type="button"
            onClick={handleGoogleMock}
            className="w-full bg-white border border-slate-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-slate-50 shadow-sm"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
            Sign in with Google Account
          </button>
        </div>
      </div>

      <div className="mt-12 text-center pb-8">
        <button 
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
          }}
          className="text-slate-600 font-bold text-sm"
        >
          {mode === 'login' ? "Don't have an account yet? " : "Already have an account? "}
          <span className="text-blue-600 underline underline-offset-4 decoration-2">{mode === 'login' ? 'Register Now' : 'Login'}</span>
        </button>
      </div>
    </div>
  );
};

export default Auth;
