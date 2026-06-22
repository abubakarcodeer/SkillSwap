import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  const load = () => {
    api.get('/admin/stats').then(r => setStats(r.data));
    api.get('/admin/users').then(r => setUsers(r.data));
    api.get('/admin/reports').then(r => setReports(r.data));
  };
  useEffect(() => { load(); }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Admin</h1>
      {stats && (
        <div className="grid md:grid-cols-3 gap-4">
          <Stat k="Users" v={stats.users} />
          <Stat k="Sessions" v={stats.sessions} />
          <Stat k="Open reports" v={stats.openReports} />
        </div>
      )}
      <div className="card">
        <h2 className="font-semibold mb-3">Users</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
          <tbody>{users.map(u => (
            <tr key={u._id} className="border-t border-slate-200 dark:border-slate-800">
              <td className="py-2">{u.name}</td><td>{u.email}</td><td>{u.role}</td>
              <td><button className="text-red-600" onClick={async () => { await api.delete(`/admin/users/${u._id}`); load(); }}>Delete</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-3">Reports</h2>
        {reports.map(r => (
          <div key={r._id} className="flex justify-between border-b border-slate-200 dark:border-slate-800 py-2">
            <div>
              <div>{r.reporter?.name} → {r.target?.name}</div>
              <div className="text-sm text-slate-500">{r.reason}</div>
            </div>
            {!r.resolved && <button className="btn-ghost" onClick={async () => { await api.patch(`/admin/reports/${r._id}/resolve`); load(); }}>Resolve</button>}
          </div>
        ))}
      </div>
    </main>
  );
}
function Stat({ k, v }) {
  return <div className="card"><div className="text-slate-500 text-sm">{k}</div><div className="text-3xl font-bold mt-1">{v}</div></div>;
}
