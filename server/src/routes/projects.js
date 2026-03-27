const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const QRCode = require('qrcode');
const prisma = require('../lib/prisma');
const { uploadFile } = require('../services/cloudinary');

const upload = multer({ dest: 'uploads/' });

const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

async function withQR(project) {
  const arUrl = `${FRONTEND_URL}/ar/${project.slug}`;
  const qrCodeUrl = await QRCode.toDataURL(arUrl, { width: 300, margin: 2 });
  return { ...project, arUrl, qrCodeUrl };
}

function cleanupFile(path) {
  fs.unlink(path, (err) => {
    if (err) console.warn('Failed to delete temp file:', path);
  });
}

// GET /api/projects – all projects for the logged-in user
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects – create a new project
router.post('/', upload.fields([
  { name: 'targetImage', maxCount: 1 },
  { name: 'overlayVideo', maxCount: 1 },
]), async (req, res) => {
  const targetImageFile = req.files?.['targetImage']?.[0];
  const overlayVideoFile = req.files?.['overlayVideo']?.[0];

  if (!targetImageFile || !overlayVideoFile) {
    if (targetImageFile) cleanupFile(targetImageFile.path);
    if (overlayVideoFile) cleanupFile(overlayVideoFile.path);
    return res.status(400).json({ error: 'Both targetImage and overlayVideo are required' });
  }

  try {
    const { title, description } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const [targetImageUrl, overlayVideoUrl] = await Promise.all([
      uploadFile(targetImageFile.path, 'ar-platform/images'),
      uploadFile(overlayVideoFile.path, 'ar-platform/videos', 'video'),
    ]);

    // Clean up temp files after successful upload
    cleanupFile(targetImageFile.path);
    cleanupFile(overlayVideoFile.path);

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substr(2, 4)}`;

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        targetImage: targetImageUrl,
        overlayVideo: overlayVideoUrl,
        slug,
        userId: req.userId,
      },
    });

    res.json(await withQR(project));
  } catch (error) {
    cleanupFile(targetImageFile.path);
    cleanupFile(overlayVideoFile.path);
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /api/projects/:id – single project with QR code
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(await withQR(project));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.project.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
