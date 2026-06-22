import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [password, setPassword] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/reset', { token: params.get('token'), password });
      toast.success('Password updated'); nav('/login');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Set a new password</h1>
      <form onSubmit={submit} className="card space-y-4">
        <input className="input" placeholder="New password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn-primary w-full">Update password</button>
      </form>
    </div>
  );
}
