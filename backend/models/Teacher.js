import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  department: { type: String },
  subject: { type: String, required: true },
  bio: { type: String },
  photo: { type: String },
  documents: [{ name: String, url: String }],
  hod: { type: mongoose.Schema.Types.ObjectId, ref: 'HOD', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Teacher', teacherSchema);