import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import principalRoutes from './routes/principal.js';
import hodRoutes from './routes/hod.js';
import teacherRoutes from './routes/teacher.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://school-portal-lovat.vercel.app/'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/principals', principalRoutes);
app.use('/api/hods', hodRoutes);
app.use('/api/teachers', teacherRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'School Portal API Running ✅' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('❌ MongoDB Error:', err));