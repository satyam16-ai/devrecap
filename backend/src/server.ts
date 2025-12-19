import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import paymentRoutes from './routes/paymentRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.routes';
import statsRoutes from './routes/stats.routes';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.use('/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
    res.send('DevRecap API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
