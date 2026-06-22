import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Profile() {
  const { user, setUser } = useAuth();
  const [f, setF] = useState(() => ({
    name: user.name || '', university: user.university || '', program: user.program || '', bio: user.bio || '',
    teach: user.teach || [], learn: user.learn || [], availability: user.availability || [],
  }));

  const save = async () => {
    const { data } = await api.patch('/users/me', f);
    setUser(data); toast.success('Profile saved');
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append('avatar', file);
    const { data } = await api.post('/users/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setUser(data); toast.success('Avatar updated');
  };

  const addSkill = (key) => setF({ ...f, [key]: [...f[key], { name: '', level: 'Beginner' }] });
  const updSkill = (key, i, v) => setF({ ...f, [key]: f[key].map((s, idx) => idx === i ? { ...s, ...v } : s) });
  const delSkill = (key, i) => setF({ ...f, [key]: f[key].filter((_, idx) => idx !== i) });

  const addSlot = () => setF({ ...f, availability: [...f.availability, { day: 'Mon', from: '14:00', to: '16:00' }] });
  const updSlot = (i, v) => setF({ ...f, availability: f.availability.map((s, idx) => idx === i ? { ...s, ...v } : s) });
  const delSlot = (i) => setF({ ...f, availability: f.availability.filter((_, idx) => idx !== i) });

  const avatarUrl = user.avatar?.startsWith('/uploads') ? import.meta.env.VITE_API_URL + user.avatar : user.avatar;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="card flex items-center gap-6">
        {avatarUrl
          ? <img src={avatarUrl} className="w-20 h-20 rounded-full object-cover" alt="" />
          : <div className="w-20 h-20 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-2xl font-bold">{user.name?.[0]}</div>}
        <div>
          <label className="btn-ghost cursor-pointer">
            Upload avatar
            <input type="file" accept="image/*" hidden onChange={uploadAvatar} />
          </label>
        </div>
      </div>

      <div className="card grid md:grid-cols-2 gap-4">
        <Field label="Name"><input className="input" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="University"><input className="input" value={f.university} onChange={e => setF({ ...f, university: e.target.value })} /></Field>
        <Field label="Degree / program"><input className="input" value={f.program} onChange={e => setF({ ...f, program: e.target.value })} /></Field>
        <Field label="Bio" className="md:col-span-2"><textarea className="input" rows={3} value={f.bio} onChange={e => setF({ ...f, bio: e.target.value })} /></Field>
      </div>

      <SkillsSection title="Skills I can teach" items={f.teach} onAdd={() => addSkill('teach')} onUpd={(i, v) => updSkill('teach', i, v)} onDel={i => delSkill('teach', i)} />
      <SkillsSection title="Skills I want to learn" items={f.learn} onAdd={() => addSkill('learn')} onUpd={(i, v) => updSkill('learn', i, v)} onDel={i => delSkill('learn', i)} />

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Availability</h2>
          <button className="btn-ghost" onClick={addSlot}>+ Add slot</button>
        </div>
        <div className="space-y-2">
          {f.availability.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select className="input" value={s.day} onChange={e => updSlot(i, { day: e.target.value })}>{DAYS.map(d => <option key={d}>{d}</option>)}</select>
              <input className="input" type="time" value={s.from} onChange={e => updSlot(i, { from: e.target.value })} />
              <input className="input" type="time" value={s.to} onChange={e => updSlot(i, { to: e.target.value })} />
              <button className="btn-ghost" onClick={() => delSlot(i)}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={save}>Save changes</button>
    </main>
  );
}

function Field({ label, className = '', children }) {
  return <div className={className}><label className="text-sm text-slate-500 mb-1 block">{label}</label>{children}</div>;
}

function SkillsSection({ title, items, onAdd, onUpd, onDel }) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">{title}</h2>
        <button className="btn-ghost" onClick={onAdd}>+ Add</button>
      </div>
      <div className="space-y-2">
        {items.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input className="input" placeholder="Skill name" value={s.name} onChange={e => onUpd(i, { name: e.target.value })} />
            <select className="input max-w-[12rem]" value={s.level} onChange={e => onUpd(i, { level: e.target.value })}>
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
            <button className="btn-ghost" onClick={() => onDel(i)}>Remove</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">None yet.</p>}
      </div>
    </div>
  );
}
