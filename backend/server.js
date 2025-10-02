const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require("./routes/authRoutes");
const categoriesRoutes = require('./routes/categories');
const biographyRoutes = require('./routes/biography');
const paintingsRoutes = require('./routes/paintings');

const app = express();
app.get('/healthz', (req,res)=>res.json({ok:true}));
app.use(helmet());
app.use(rateLimit({ windowMs: 10 * 60 * 1000, limit: 300 }));
app.set('trust proxy', 1);

// DB
connectDB();

// MIDDLEWARES ΠΡΙΝ ΑΠΟ ΤΑ ROUTES
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ROUTES
app.use('/auth', authRoutes);
app.use('/login', authRoutes);

app.use('/api/categories', categoriesRoutes);
app.use('/api/biography', biographyRoutes);
app.use('/api/paintings', paintingsRoutes);
app.use('/api/exhibitions', require('./routes/exhibitions'));
app.use('/api/links', require('./routes/links'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
