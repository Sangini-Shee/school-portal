import mongoose from 'mongoose';

const hodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  department: { type: String, required: true },
  subject: { type: String },
  bio: { type: String },
  photo: { type: String },
  documents: [{ name: String, url: String }],
  principal: { type: mongoose.Schema.Types.ObjectId, ref: 'Principal', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('HOD', hodSchema);