const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { uploadFile } = require('../services/cloudinary');

const prisma = new PrismaClient();

const upload = multer({ dest: 'uploads/' });

// GET - כל הפרויקטים של המשתמש
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

// POST - יצירת פרויקט חדש
router.post('/', upload.fields([
  { name: 'targetImage', maxCount: 1 },
  { name: 'overlayVideo', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, description } = req.body;
    const targetImageFile = req.files['targetImage'][0];
    const overlayVideoFile = req.files['overlayVideo'][0];

    const targetImageUrl = await uploadFile(targetImageFile.path, 'ar-platform/images');
    const overlayVideoUrl = await uploadFile(overlayVideoFile.path, 'ar-platform/videos', 'video');

    const slug = `${title.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 4)}`;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        targetImage: targetImageUrl,
        overlayVideo: overlayVideoUrl,
        slug,
        userId: req.userId,
      },
    });

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET - פרויקט ספציפי לפי ID
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// DELETE - מחיקת פרויקט
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