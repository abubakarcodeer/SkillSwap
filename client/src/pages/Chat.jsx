import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';

export default function Chat() {
  const { user } = useAuth();
  const socket = useSocket();
  const { userId } = useParams();
  const [recent, setRecent] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [peer, setPeer] = useState(null);
  const [showBook, setShowBook] = useState(false);
  const [bookData, setBookData] = useState({ skill: '', startsAt: '', notes: '' });
  const endRef = useRef();

  useEffect(() => { api.get('/chat/recent').then(r => setRecent(r.data)); }, []);

  useEffect(() => {
    if (!userId) return;
    api.get(`/users/${userId}`).then(r => setPeer(r.data));
    api.get(`/chat/${userId}`).then(r => setMsgs(r.data));
  }, [userId]);

  useEffect(() => {
    if (!socket) return;
    const onNew = (m) => {
      const fromId = m.from._id || m.from;
      const toId = m.to._id || m.to;

      if (userId && (String(fromId) === userId || String(toId) === userId)) {
        setMsgs(prev => [...prev, m]);
      }

      setRecent(prev => {
        const otherId = String(fromId) === String(user._id) ? String(toId) : String(fromId);
        const filtered = prev.filter(r => {
          const rOtherId = String(r.from._id || r.from) === String(user._id) ? String(r.to._id || r.to) : String(r.from._id || r.from);
          return rOtherId !== otherId;
        });
        return [m, ...filtered];
      });
    };
    socket.on('message:new', onNew);
    return () => socket.off('message:new', onNew);
  }, [socket, userId, user._id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = () => {
    if (!text.trim() || !socket || !userId) return;
    socket.emit('message:send', { to: userId, text });
    setText('');
  };

  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file || !socket || !userId) return;
    const fd = new FormData(); fd.append('file', file);
    const { data } = await api.post('/chat/upload', fd);
    socket.emit('message:send', { to: userId, fileUrl: data.url });
  };

  const bookSession = async () => {
    try {
      if (!bookData.skill || !bookData.startsAt) return toast.error('Please fill all fields');
      await api.post('/sessions', { ...bookData, host: userId });
      toast.success('Session request sent!');
      setShowBook(false);
      setBookData({ skill: '', startsAt: '', notes: '' });
      socket.emit('message:send', { to: userId, text: `📅 I requested a session for ${bookData.skill}` });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-3.5rem)]">
      <aside className="card overflow-y-auto">
        <h2 className="font-semibold mb-3">Conversations</h2>
        {recent.map(m => {
          const other = String(m.from._id || m.from) === String(user._id) ? m.to : m.from;
          return (
            <a key={m._id} href={`/chat/${other._id || other}`} className="flex gap-2 items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className={`w-2 h-2 rounded-full ${other.online ? 'bg-green-500' : 'bg-slate-400'}`} />
              <span className="truncate">{other.name || 'User'}</span>
            </a>
          );
        })}
      </aside>

      <section className="card flex flex-col relative">
        {!userId && <div className="m-auto text-slate-500">Pick a conversation</div>}
        {userId && (
          <>
            <header className="border-b border-slate-200 dark:border-slate-800 pb-2 mb-2 flex justify-between items-center">
              <div className="font-semibold">
                {peer?.name} {peer?.online && <span className="text-xs text-green-500 ml-2">● online</span>}
              </div>
              <button onClick={() => setShowBook(true)} className="text-xs btn-primary py-1 px-3">Book Session</button>
            </header>

            {showBook && (
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 z-10 flex items-center justify-center p-4">
                <div className="card w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold mb-4">Book a session with {peer?.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Select Skill</label>
                      <select className="input" value={bookData.skill} onChange={e => setBookData({ ...bookData, skill: e.target.value })}>
                        <option value="">Choose a skill...</option>
                        {peer?.teach?.map(s => <option key={s.name} value={s.name}>{s.name} ({s.level})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Date & Time</label>
                      <input type="datetime-local" className="input" value={bookData.startsAt} onChange={e => setBookData({ ...bookData, startsAt: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Notes (Optional)</label>
                      <textarea className="input text-sm" rows={2} placeholder="What do you want to learn?" value={bookData.notes} onChange={e => setBookData({ ...bookData, notes: e.target.value })} />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button className="btn-primary flex-1" onClick={bookSession}>Send Request</button>
                      <button className="btn-ghost flex-1" onClick={() => setShowBook(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2">
              {msgs.map(m => {
                const fromId = m.from._id || m.from;
                const mine = String(fromId) === String(user._id);
                return (
                  <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-3 py-2 rounded-2xl ${mine ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      {m.text}
                      {m.fileUrl && <a href={import.meta.env.VITE_API_URL + m.fileUrl} target="_blank" className="underline block">📎 File</a>}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
            <div className="mt-2 flex gap-2">
              <label className="btn-ghost cursor-pointer">📎<input type="file" hidden onChange={upload} /></label>
              <input className="input" placeholder="Type a message... 😊" value={text}
                onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
              <button className="btn-primary" onClick={send}>Send</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
