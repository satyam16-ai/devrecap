import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/auth.routes';
import statsRoutes from './routes/stats.routes';

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
    res.send('DevRecap API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
