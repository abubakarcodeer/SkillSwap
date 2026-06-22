import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const submit = async (e) => {
    e.preventDefault();
    try { await signup(f.name, f.email, f.password); nav('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.message || 'Signup failed'); }
  };
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Create your account</h1>
      <form onSubmit={submit} className="card space-y-4">
        <input className="input" placeholder="Full name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
        <button className="btn-primary w-full">Sign up</button>
        <a href={`${import.meta.env.VITE_API_URL}/api/auth/google`} className="btn-ghost w-full">Continue with Google</a>
        <div className="text-sm">Already have an account? <Link to="/login" className="text-brand-600">Sign in</Link></div>
      </form>
    </div>
  );
}
