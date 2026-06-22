import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const link = ({ isActive }) => `px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`;

  return (
    <header className="sticky top-0 z-30 backdrop-blur border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">Skill<span className="text-brand-600">Swap</span></Link>
        <nav className="flex items-center gap-1">
          {user && <>
            <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
            <NavLink to="/matches" className={link}>Matches</NavLink>
            <NavLink to="/chat" className={link}>Chat</NavLink>
            <NavLink to="/sessions" className={link}>Sessions</NavLink>
            <NavLink to="/profile" className={link}>Profile</NavLink>
            {user.role === 'admin' && <NavLink to="/admin" className={link}>Admin</NavLink>}
          </>}
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          {user ? (
            <button onClick={logout} className="btn-ghost"><LogOut size={16} className="mr-1" />Logout</button>
          ) : (
            <Link to="/login" className="btn-primary">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
