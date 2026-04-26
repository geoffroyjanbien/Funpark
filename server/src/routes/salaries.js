const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

// Employee routes
router.get('/employees', salaryController.getAllEmployees);
router.get('/employees/:id', salaryController.getEmployeeById);
router.post('/employees', salaryController.createEmployee);
router.put('/employees/:id', salaryController.updateEmployee);
router.delete('/employees/:id', salaryController.deleteEmployee);

// Payment routes
router.get('/payments', salaryController.getAllPayments);
router.get('/payments/employee/:employeeId', salaryController.getPaymentsByEmployee);
router.get('/payments/month', salaryController.getPaymentsByMonth);
router.post('/payments', salaryController.createPayment);
router.put('/payments/:id', salaryController.updatePayment);
router.delete('/payments/:id', salaryController.deletePayment);

// Summary route
router.get('/summary', salaryController.getSalarySummary);

module.exports = router;
