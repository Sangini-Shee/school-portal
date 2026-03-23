import mongoose from 'mongoose';

const principalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  department: { type: String, default: 'Administration' },
  bio: { type: String },
  photo: { type: String },       // Cloudinary URL
  documents: [{ name: String, url: String }], // PDF URLs
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Principal', principalSchema);