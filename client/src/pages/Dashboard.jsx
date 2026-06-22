import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/matches').then(r => setMatches(r.data.slice(0, 4)));
    api.get('/sessions').then(r => setSessions(r.data.filter(s => s.status !== 'completed').slice(0, 5)));
    api.get('/chat/recent').then(r => setRecent(r.data.slice(0, 5)));
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Hi {user?.name?.split(' ')[0]} 👋</h1>
      <p className="text-slate-500 mt-1">Here's what's happening on your campus.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recommended partners</h2>
            <Link to="/matches" className="text-brand-600 text-sm">See all</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {matches.length === 0 && <p className="text-slate-500">Complete your profile to see matches.</p>}
            {matches.map(m => (
              <div key={m.user._id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex gap-3">
                <Avatar user={m.user} />
                <div className="flex-1">
                  <div className="font-medium">{m.user.name}</div>
                  <div className="text-xs text-slate-500">{m.user.university || '—'}</div>
                  <div className="text-xs mt-1 text-brand-600 font-semibold">{m.percent}% match</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Upcoming sessions</h2>
          {sessions.length === 0 && <p className="text-slate-500 text-sm">No sessions yet.</p>}
          <ul className="space-y-3">
            {sessions.map(s => (
              <li key={s._id} className="text-sm">
                <div className="font-medium">{s.skill}</div>
                <div className="text-slate-500">{new Date(s.startsAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card md:col-span-3">
          <h2 className="font-semibold mb-4">Recent chats</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recent.map(m => {
              const fromId = m.from._id || m.from;
              const other = String(fromId) === String(user._id) ? m.to : m.from;
              const otherId = other._id || other;
              return (
                <Link key={m._id} to={`/chat/${otherId}`} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Avatar user={typeof other === 'object' ? other : { name: 'User' }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{other.name || 'User'}</div>
                    <div className="text-xs text-slate-500 truncate">{m.text || '📎 file'}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

function Avatar({ user }) {
  const url = user.avatar?.startsWith('/uploads') ? import.meta.env.VITE_API_URL + user.avatar : user.avatar;
  return url
    ? <img src={url} className="w-10 h-10 rounded-full object-cover" alt="" />
    : <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold">{user.name?.[0]}</div>;
}
