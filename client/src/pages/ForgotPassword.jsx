import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    await api.post('/auth/forgot', { email });
    toast.success('If that email exists, a reset link was sent');
  };
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Forgot password</h1>
      <form onSubmit={submit} className="card space-y-4">
        <input className="input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="btn-primary w-full">Send reset link</button>
      </form>
    </div>
  );
}
