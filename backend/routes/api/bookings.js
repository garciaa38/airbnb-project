const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

//EDIT A BOOKING --- NOT COMPLETE
router.put(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const {bookingId} = req.params;
        const {startDate, endDate} = req.body;
        const errors = {};

        const findBooking = await Booking.findByPk(bookingId);

        if (!findBooking) {
            res.status(404).json({
                message: "Booking couldn't be found"
            })
        } else if (findBooking.userId !== req.user.id) {
            res.status(403).json({
                message: "Forbidden"
            })
        } else if (new Date().toISOString().split('T')[0] > new Date(findBooking.endDate).toISOString().split('T')[0]) {
            res.status(403).json({
                message: "Past bookings can't be modified"
            })
        } else {
            const currSpotBookings = await Booking.findAll({
                where: {
                    spotId: findBooking.spotId
                },
                attributes: ['startDate', 'endDate']
            })

            if (currSpotBookings.length > 0) {
                const conflictErrors = {};

                for (let i = 0; i < currSpotBookings.length; i++) {
                    const currSpotStartDate = new Date(currSpotBookings[i].startDate).toISOString().split('T')[0];
                    const currSpotEndDate = new Date(currSpotBookings[i].endDate).toISOString().split('T')[0];
                    const reqStartDate = new Date(startDate).toISOString().split('T')[0];
                    const reqEndDate = new Date(endDate).toISOString().split('T')[0];

                    if ((reqStartDate === currSpotStartDate) ||
                        (reqStartDate > currSpotStartDate && reqStartDate < currSpotEndDate)) {
                            conflictErrors.startDate = "Start date conflicts with an existing booking"
                        }

                    if ((reqEndDate === currSpotEndDate) ||
                        (reqEndDate > currSpotStartDate && reqEndDate < currSpotEndDate)) {
                            conflictErrors.endDate = "End date conflicts with an existing booking"
                        }

                    if (Object.keys(conflictErrors).length > 0) {
                        const errorMsg = {
                            message: "Sorry, this spot is already booked for the specified dates",
                            errors: conflictErrors
                        }
                        return res.status(403).json(errorMsg);
                    }
                }
            }

            await findBooking.update({
                startDate,
                endDate
            })
            .catch((error) => {
                for (let i = 0; i < error.errors.length; i++) {
                    let key = error.errors[i].path
                    errors[`${key}`] = error.errors[i].message
                }
            });

            if (Object.keys(errors).length > 0) {
                const errorMsg = {
                    message: "Bad Request",
                    errors: errors
                }

                return res.status(400).json(errorMsg);
            } else {
                return res.json({
                    id: findBooking.id,
                    userId: findBooking.userId,
                    spotId: Number(findBooking.spotId),
                    startDate: new Date(findBooking.startDate).toISOString().split('T')[0],
                    endDate: new Date(findBooking.endDate).toISOString().split('T')[0],
                    updatedAt: findBooking.updatedAt,
                    createdAt: findBooking.createdAt
                });
            }
        }
    }
)


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
