const express = require('express');
const router = express.Router();
const protect = require('../../middleware/authMiddleware');
const {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} = require('../../controllers/customerController');

router.get('/', protect, getCustomers);
router.post('/', protect, createCustomer);
router.put('/:id', protect, updateCustomer);

// ΠΡΟΣΘΗΚΗ PATCH route για updateCustomer
router.patch('/:id', protect, updateCustomer);

router.delete('/:id', protect, deleteCustomer);



module.exports = router;
