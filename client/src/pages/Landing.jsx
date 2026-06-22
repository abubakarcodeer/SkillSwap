import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main>
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm">For students, by students</span>
        <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight">Trade skills.<br/>Grow together.</h1>
        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          SkillSwap matches you with learning partners on your campus. Teach what you know, learn what you don't — all in one place.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link to="/signup" className="btn-primary">Get started</Link>
          <Link to="/login" className="btn-ghost">Sign in</Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          ['10k+', 'Students matched'],
          ['200+', 'Universities'],
          ['1.2M', 'Hours exchanged'],
        ].map(([n, l]) => (
          <div key={l} className="card text-center">
            <div className="text-4xl font-bold text-brand-600">{n}</div>
            <div className="mt-1 text-slate-500">{l}</div>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">What students say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ['I learned React in 3 weeks from a senior on campus.', 'Aisha · CS Junior'],
            ['Best way to find study partners that actually show up.', 'Rohan · ME'],
            ['Taught Python, learned French. SkillSwap changed my semester.', 'Lena · BBA'],
          ].map(([q, w]) => (
            <div key={w} className="card">
              <p>"{q}"</p>
              <div className="mt-4 text-sm text-slate-500">{w}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
