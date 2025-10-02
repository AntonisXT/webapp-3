const express = require('express');
const router = express.Router();
const multer = require('multer');
const Painting = require('../models/painting');
const auth = require('../middleware/auth');
const { z, validator } = require('../middleware/validate');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, cb) => cb(null, /^image\/(png|jpe?g|webp)$/.test(file.mimetype)) }); // 10MB per file

// List by subcategory
router.get('/:subcategoryId', async (req, res) => {
  try {
    const page = req.query.page ? Math.max(1, parseInt(req.query.page)) : null;
    const limit = req.query.limit ? Math.min(50, Math.max(1, parseInt(req.query.limit))) : null;
    const baseQuery = Painting.find({ subcategory: req.params.subcategoryId }).sort({ createdAt: -1 });
    let items, total;
    if (page && limit) {
      [items, total] = await Promise.all([
        baseQuery.skip((page-1)*limit).limit(limit),
        Painting.countDocuments({ subcategory: req.params.subcategoryId })
      ]);
    } else {
      items = await baseQuery;
    }
    // convert to base64 for frontend
    const payload = items.map(p => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      originalName: p.originalName,
      mimeType: p.mimeType,
      createdAt: p.createdAt,
      dataUrl: `data:${p.mimeType};base64,${p.imageData.toString('base64')}`
    }));
    if (page && limit) { return res.json({ page, limit, total, pages: Math.ceil(total/limit), items: payload }); } return res.json(payload);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Upload one or more images
router.post('/:subcategoryId', auth, upload.array('images', 10), async (req, res) => {
  try {
    const descs = Array.isArray(req.body.descriptions) ? req.body.descriptions : (req.body.descriptions ? [req.body.descriptions] : []);
    const created = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const description = descs[i] || '';
      const doc = await Painting.create({
        subcategory: req.params.subcategoryId,
        title: file.originalname,
        originalName: file.originalname,
        description,
        imageData: file.buffer,
        mimeType: file.mimetype
      });
      created.push(doc);
    }
    res.json(created);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.delete('/item/:id', auth, async (req, res) => {
  try {
    await Painting.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;