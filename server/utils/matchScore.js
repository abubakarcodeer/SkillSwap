// Match score between current user (me) and candidate (them)
const levelRank = { Beginner: 1, Intermediate: 2, Advanced: 3 };

function overlap(a, b) {
  const setB = new Map(b.map(s => [s.name.toLowerCase(), s.level]));
  let score = 0; const matched = [];
  for (const s of a) {
    const lvl = setB.get(s.name.toLowerCase());
    if (lvl) {
      // teacher level >= learner level is ideal
      const diff = (levelRank[lvl] || 1) - (levelRank[s.level] || 1);
      score += diff >= 0 ? 1 : 0.5;
      matched.push(s.name);
    }
  }
  return { score, matched };
}

function availabilityOverlap(a = [], b = []) {
  const key = x => `${x.day}-${x.from}-${x.to}`;
  const setB = new Set(b.map(key));
  return a.filter(x => setB.has(key(x))).length;
}

module.exports = function matchScore(me, them) {
  const teach = overlap(them.teach || [], me.learn || []); // they teach what I learn
  const learn = overlap(them.learn || [], me.teach || []); // they learn what I teach
  const avail = availabilityOverlap(me.availability, them.availability);
  const raw = teach.score * 2 + learn.score * 1.5 + avail * 0.5;
  const max = (me.learn?.length || 1) * 2 + (me.teach?.length || 1) * 1.5 + 3;
  const percent = Math.min(100, Math.round((raw / max) * 100));
  return { percent, matchedTeach: teach.matched, matchedLearn: learn.matched };
};
