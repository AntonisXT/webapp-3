const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require("./routes/authRoutes");
const categoriesRoutes = require('./routes/categories');
const biographyRoutes = require('./routes/biography');
const paintingsRoutes = require('./routes/paintings');

const app = express();
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');


app.use(helmet());
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || null;
app.use(cors({
  origin: FRONTEND_ORIGIN ? [FRONTEND_ORIGIN] : true,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(mongoSanitize());


// DB
connectDB();

// MIDDLEWARES ΠΡΙΝ ΑΠΟ ΤΑ ROUTES
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

require('./docs')(app);

// ROUTES

const loginLimiter = rateLimit({ windowMs: 15*60*1000, max: 10, standardHeaders: true, legacyHeaders: false });
app.use('/auth/login', loginLimiter);

app.use('/auth', authRoutes);

app.use('/api/categories', categoriesRoutes);
app.use('/api/biography', biographyRoutes);
app.use('/api/paintings', paintingsRoutes);
app.use('/api/exhibitions', require('./routes/exhibitions'));
app.use('/api/links', require('./routes/links'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// 404 handler
app.use((req, res) => res.status(404).json({ msg: 'Not found' }));

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ msg: 'Server error' });
});
