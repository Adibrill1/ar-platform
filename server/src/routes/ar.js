const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/ar/:slug – public, used by the AR viewer HTML page
router.get('/:slug', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
    });
    if (!project || !project.isPublic) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({
      title: project.title,
      targetImageUrl: project.targetImage,
      overlayVideoUrl: project.overlayVideo,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/ar/:slug/view – public, increments view counter
router.post('/:slug/view', async (req, res) => {
  try {
    await prisma.project.update({
      where: { slug: req.params.slug },
      data: { viewCount: { increment: 1 } },
    });
    res.json({ ok: true });
  } catch {
    res.json({ ok: false }); // fail silently – tracking is best-effort
  }
});

module.exports = router;
