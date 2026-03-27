// Paths are relative (/api/...) so they work via:
// - Vite proxy in development (→ localhost:3001)
// - Vercel rewrite in production (→ Railway server)

export const getProjects = async (token) => {
  const res = await fetch('/api/projects', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

export const getProject = async (id, token) => {
  const res = await fetch(`/api/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
};

export const deleteProject = async (id, token) => {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
};
