const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const categoriesRoutes = require('./routes/categories');
const biographyRoutes = require('./routes/biography');
const paintingsRoutes = require('./routes/paintings');

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || true;
app.use(cors({ origin: FRONTEND_ORIGIN === true ? true : [FRONTEND_ORIGIN], credentials: true }));
app.use(mongoSanitize());
const loginLimiter = rateLimit({ windowMs: 15*60*1000, max: 10 });
app.use('/auth/login', loginLimiter);

// DB
connectDB();

// MIDDLEWARES ΠΡΙΝ ΑΠΟ ΤΑ ROUTES
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

require('./docs')(app);

// ROUTES
app.use('/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/biography', biographyRoutes);
app.use('/api/paintings', paintingsRoutes);
app.use('/api/exhibitions', require('./routes/exhibitions'));
app.use('/api/links', require('./routes/links'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// 404
app.use((req,res)=>res.status(404).json({ msg: 'Not found' }));
// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ msg: 'Server error' });
});

app.get('/healthz', (_req,res)=>res.json({ok:true}));
