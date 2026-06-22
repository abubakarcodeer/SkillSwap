import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await login(email, password); nav('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
  };
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Welcome back</h1>
      <form onSubmit={submit} className="card space-y-4">
        <input className="input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn-primary w-full">Sign in</button>
        <a href={`${import.meta.env.VITE_API_URL}/api/auth/google`} className="btn-ghost w-full">Continue with Google</a>
        <div className="text-sm flex justify-between">
          <Link to="/forgot-password" className="text-brand-600">Forgot password?</Link>
          <Link to="/signup" className="text-brand-600">Create account</Link>
        </div>
      </form>
    </div>
  );
}
