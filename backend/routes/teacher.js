import express from 'express';
import Teacher from '../models/Teacher.js';
import adminAuth from '../middleware/adminAuth.js';
import { upload } from '../cloudinary.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const teachers = await Teacher.find().populate('hod', 'name department');
  res.json(teachers);
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  const regex = new RegExp(q, 'i');
  const teachers = await Teacher.find({
    $or: [{ name: regex }, { subject: regex }, { department: regex }]
  }).populate('hod', 'name');
  res.json(teachers);
});

router.get('/:id', async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate('hod', 'name department');
  res.json(teacher);
});

router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), async (req, res) => {
  const { name, email, phone, department, subject, bio, hod } = req.body;
  const photo = req.files?.photo?.[0]?.path || '';
  const documents = req.files?.documents?.map(f => ({ name: f.originalname, url: f.path })) || [];
  const teacher = await Teacher.create({ name, email, phone, department, subject, bio, photo, documents, hod });
  res.status(201).json(teacher);
});

router.put('/:id', adminAuth, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), async (req, res) => {
  const updates = { ...req.body };
  if (req.files?.photo?.[0]) updates.photo = req.files.photo[0].path;
  if (req.files?.documents?.length) {
    updates.$push = { documents: { $each: req.files.documents.map(f => ({ name: f.originalname, url: f.path })) } };
  }
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(teacher);
});

router.delete('/:id', async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

export default router;