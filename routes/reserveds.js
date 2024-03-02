const express = require('express');
const {getReserveds, getReserved, addReserved, updateReserved, deleteReserved} = require('../controllers/reserveds');

const router = express.Router({mergeParams:true});

const {protect,authorize} = require('../middleware/auth');

router.route('/')
    .get(protect, getReserveds)
    .post(protect, authorize('admin','user'), addReserved);
router.route('/:id')
    .get(protect, getReserved)
    .put(protect, authorize('admin','user'), updateReserved)
    .delete(protect, authorize('admin','user'), deleteReserved);

module.exports = router;