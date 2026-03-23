import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/verify-pin', (req, res) => {
  const { pin } = req.body;
  if (pin === process.env.ADMIN_PIN) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, message: 'Invalid PIN' });
});

export default router;