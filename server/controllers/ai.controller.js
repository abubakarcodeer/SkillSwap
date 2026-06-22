const OpenAI = require('openai');

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function ask(prompt) {
  if (!client) return `[AI disabled - set OPENAI_API_KEY]\n${prompt}`;
  const r = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  });
  return r.choices[0].message.content;
}

exports.suggestSkills = async (req, res) => {
  const u = req.user;
  const text = await ask(`Suggest 5 new skills to learn for a ${u.program || 'student'} who already teaches ${u.teach?.map(s=>s.name).join(', ') || 'nothing yet'} and wants to learn ${u.learn?.map(s=>s.name).join(', ') || 'anything'}. Reply as a JSON array of strings.`);
  res.json({ text });
};

exports.roadmap = async (req, res) => {
  const { skill } = req.body;
  const text = await ask(`Create a 6-week personalized learning roadmap for a beginner learning "${skill}". Use weekly milestones and project ideas. Markdown.`);
  res.json({ text });
};

exports.sessionTopics = async (req, res) => {
  const { skill } = req.body;
  const text = await ask(`Suggest 5 specific session topics for teaching "${skill}" to a beginner. Markdown bullet list.`);
  res.json({ text });
};
