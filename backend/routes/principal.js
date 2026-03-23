import express from 'express';
import Principal from '../models/Principal.js';
import HOD from '../models/HOD.js';
import adminAuth from '../middleware/adminAuth.js';
import { upload } from '../cloudinary.js';

const router = express.Router();

// Get all principals (public)
router.get('/', async (req, res) => {
  const principals = await Principal.find();
  res.json(principals);
});

// Get one principal + their HODs
router.get('/:id', async (req, res) => {
  const principal = await Principal.findById(req.params.id);
  const hods = await HOD.find({ principal: req.params.id });
  res.json({ principal, hods });
});

// Create principal (admin only)
router.post('/', adminAuth, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), async (req, res) => {
  const { name, email, phone, department, bio } = req.body;
  const photo = req.files?.photo?.[0]?.path || '';
  const documents = req.files?.documents?.map(f => ({
    name: f.originalname, url: f.path
  })) || [];

  const principal = await Principal.create({ name, email, phone, department, bio, photo, documents });
  res.status(201).json(principal);
});

// Update principal (admin only)
router.put('/:id', adminAuth, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), async (req, res) => {
  const updates = { ...req.body };
  if (req.files?.photo?.[0]) updates.photo = req.files.photo[0].path;
  if (req.files?.documents?.length) {
    updates.$push = {
      documents: { $each: req.files.documents.map(f => ({ name: f.originalname, url: f.path })) }
    };
  }
  const principal = await Principal.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(principal);
});

// Delete principal (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  await Principal.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

export default router;