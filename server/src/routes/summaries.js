const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// GET /api/summaries/daily - Get daily summary
router.get('/daily', summaryController.getDailySummary);

// GET /api/summaries/monthly - Get monthly summary
router.get('/monthly', summaryController.getMonthlySummary);

// GET /api/summaries/yearly - Get yearly summary
router.get('/yearly', summaryController.getYearlySummary);

// POST /api/summaries/recalculate - Recalculate all summaries
router.post('/recalculate', summaryController.recalculateAllSummaries);

module.exports = router;