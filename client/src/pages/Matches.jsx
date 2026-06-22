import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Matches() {
  const [list, setList] = useState([]);
  useEffect(() => { api.get('/matches').then(r => setList(r.data)); }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your matches</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(m => {
          const url = m.user.avatar?.startsWith('/uploads') ? import.meta.env.VITE_API_URL + m.user.avatar : m.user.avatar;
          return (
            <div key={m.user._id} className="card">
              <div className="flex items-center gap-3">
                {url ? <img src={url} className="w-12 h-12 rounded-full object-cover" /> :
                  <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">{m.user.name[0]}</div>}
                <div>
                  <div className="font-semibold">{m.user.name}</div>
                  <div className="text-xs text-slate-500">{m.user.university || '—'} · {m.user.program || ''}</div>
                </div>
                <div className="ml-auto text-brand-600 font-bold">{m.percent}%</div>
              </div>
              <p className="text-sm mt-3 text-slate-500 line-clamp-2">{m.user.bio || 'No bio yet'}</p>
              {m.matchedTeach?.length > 0 && <p className="text-xs mt-2"><b>Can teach:</b> {m.matchedTeach.join(', ')}</p>}
              {m.matchedLearn?.length > 0 && <p className="text-xs"><b>Wants to learn:</b> {m.matchedLearn.join(', ')}</p>}
              <Link to={`/chat/${m.user._id}`} className="btn-primary w-full mt-4">Message</Link>
            </div>
          );
        })}
        {list.length === 0 && <p className="text-slate-500">No matches yet. Fill out your profile.</p>}
      </div>
    </main>
  );
}
