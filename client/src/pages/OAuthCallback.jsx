import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { setToken } = useAuth();
  useEffect(() => {
    const t = params.get('token');
    if (t) setToken(t).then(() => nav('/dashboard'));
    else nav('/login');
  }, []);
  return <div className="p-10">Signing you in...</div>;
}
