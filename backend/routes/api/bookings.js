const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

//GET ALL OF CURRENT USER BOOKINGS --- NOT COMPLETE
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const usersBookings = await Booking.findAll({
            where: {
                userId: req.user.id
            },
            include: {
                model: Spot
            }
        });

        return res.json(usersBookings);
    }
)



module.exports = router;
