import express from 'express';
import HOD from '../models/HOD.js';
import Teacher from '../models/Teacher.js';
import adminAuth from '../middleware/adminAuth.js';
import { upload } from '../cloudinary.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const hods = await HOD.find().populate('principal', 'name');
  res.json(hods);
});

router.get('/:id', async (req, res) => {
  const hod = await HOD.findById(req.params.id).populate('principal', 'name');
  const teachers = await Teacher.find({ hod: req.params.id });
  res.json({ hod, teachers });
});

router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), async (req, res) => {
  const { name, email, phone, department, subject, bio, principal } = req.body;
  const photo = req.files?.photo?.[0]?.path || '';
  const documents = req.files?.documents?.map(f => ({ name: f.originalname, url: f.path })) || [];
  const hod = await HOD.create({ name, email, phone, department, subject, bio, photo, documents, principal });
  res.status(201).json(hod);
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
  const hod = await HOD.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(hod);
});

router.delete('/:id', async (req, res) => {
  await HOD.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

export default router;