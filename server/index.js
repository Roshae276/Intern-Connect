import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // <--- Import this
import internshipRoutes from './routes/internshipRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Import
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

// Connect to Database
connectDB(); // <--- Call this



const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/upload', uploadRoutes);
// Routes
app.use('/api/internships', internshipRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/auth', authRoutes);

// This is your test route
app.get('/', (req, res) => {
  res.send('API is running... Operations Team is go.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));