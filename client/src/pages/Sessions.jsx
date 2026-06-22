import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sessions() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const load = () => api.get('/sessions').then(r => setList(r.data));
  useEffect(() => { load(); }, []);

  const respond = async (id, status, extra = {}) => {
    try {
      await api.patch(`/sessions/${id}/respond`, { status, ...extra });
      toast.success(status ? `Session ${status}` : 'Meeting updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const createMeeting = (id) => {
    const link = `https://meet.jit.si/SkillSwap-${id}-${Math.random().toString(36).substr(2, 5)}`;
    respond(id, null, { meetingLink: link });
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Sessions</h1>
      <div className="space-y-3">
        {list.map(s => {
          const iHost = String(s.host._id) === String(user._id);
          const startTime = new Date(s.startsAt);

          return (
            <div key={s._id} className="card flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.skill}</div>
                <div className="text-sm text-slate-500">
                  {startTime.toLocaleString()} · {s.durationMin}min · with {iHost ? s.guest.name : s.host.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                    s.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    s.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    s.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {s.status}
                  </span>
                  {s.notes && <span className="text-xs text-slate-400 italic">"{s.notes}"</span>}
                </div>
              </div>

              <div className="flex gap-2">
                {iHost && s.status === 'pending' && (
                  <>
                    <button className="btn-primary py-1 px-4 text-sm" onClick={() => respond(s._id, 'accepted')}>Accept</button>
                    <button className="btn-ghost py-1 px-4 text-sm" onClick={() => respond(s._id, 'rejected')}>Reject</button>
                  </>
                )}

                {s.status === 'accepted' && (
                  <>
                    {iHost && !s.meetingLink && (
                      <button
                        className="btn-primary bg-indigo-600 hover:bg-indigo-700 py-1 px-4 text-sm"
                        onClick={() => createMeeting(s._id)}
                      >
                        🚀 Create Meeting
                      </button>
                    )}

                    {s.meetingLink ? (
                      <a
                        href={s.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary bg-green-600 hover:bg-green-700 py-1 px-4 text-sm flex items-center gap-1"
                      >
                        📹 Join Meeting
                      </a>
                    ) : !iHost && (
                      <span className="text-xs text-slate-400 animate-pulse">Waiting for host to create room...</span>
                    )}

                    {iHost && (
                      <button
                        className="btn-ghost border border-slate-200 py-1 px-4 text-sm"
                        onClick={() => respond(s._id, 'completed')}
                      >
                        Done
                      </button>
                    )}
                  </>
                )}

                {s.status === 'pending' && !iHost && (
                  <button className="btn-ghost text-xs" onClick={() => respond(s._id, 'cancelled')}>Cancel Request</button>
                )}
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">No sessions scheduled yet.</p>
            <a href="/matches" className="text-brand-600 font-semibold mt-2 inline-block">Find a partner to learn from</a>
          </div>
        )}
      </div>
    </main>
  );
}
