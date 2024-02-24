const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

//EDIT A BOOKING --- COMPLETE
router.put(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const {bookingId} = req.params;
        const {startDate, endDate} = req.body;
        const errors = {};
        const findBooking = await Booking.findByPk(bookingId);

        if (!findBooking) {
            return res.status(404).json({
                message: "Booking couldn't be found"
            })
        } else if (findBooking.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            })
        } else if (new Date().toISOString().split('T')[0] > new Date(findBooking.endDate).toISOString().split('T')[0]) {
            return res.status(403).json({
                message: "Past bookings can't be modified"
            })
        } else {
            const currSpotBookings = await Booking.findAll({
                where: {
                    spotId: findBooking.spotId
                },
                attributes: ['id', 'startDate', 'endDate']
            })

            if (currSpotBookings.length > 0) {
                const conflictErrors = {};

                for (let i = 0; i < currSpotBookings.length; i++) {
                    const currSpotStartDate = new Date(currSpotBookings[i].startDate).toISOString().split('T')[0];
                    const currSpotEndDate = new Date(currSpotBookings[i].endDate).toISOString().split('T')[0];
                    const reqStartDate = new Date(startDate).toISOString().split('T')[0];
                    const reqEndDate = new Date(endDate).toISOString().split('T')[0];

                    //REFACTOR BOOKING CONFLICT CODE TO ACCOUNT FOR DATES THAT SURROUND AN EXISTING BOOKING AND DATES THAT ARE WITHIN
                    //AN EXISTING BOOKING
                    if (currSpotBookings[i].id !== Number(bookingId)) {

                        if ((reqStartDate === currSpotStartDate || reqStartDate === currSpotEndDate) ||
                        (reqStartDate > currSpotStartDate && reqStartDate < currSpotEndDate) ||
                        (reqStartDate < currSpotStartDate && reqStartDate > currSpotEndDate)) {
                            conflictErrors.startDate = "Start date conflicts with an existing booking"
                        }

                        if ((reqEndDate === currSpotEndDate || reqEndDate === currSpotStartDate) ||
                        (reqEndDate > currSpotStartDate && reqEndDate < currSpotEndDate)) {
                            conflictErrors.endDate = "End date conflicts with an existing booking"
                        }

                        if ((reqStartDate < currSpotStartDate && reqEndDate > currSpotEndDate) ||
                        (reqStartDate > currSpotStartDate && reqEndDate < currSpotEndDate)) {
                            conflictErrors.startDate = "Start date conflicts with an existing booking"
                            conflictErrors.endDate = "End date conflicts with an existing booking"
                        }
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
                let splitCreate = findBooking.createdAt.toISOString().split('T').join(' ');
                let createdAt = splitCreate.split('.')[0];
                let splitUpdate = findBooking.updatedAt.toISOString().split('T').join(' ');
                let updatedAt = splitUpdate.split('.')[0];

                return res.json({
                    id: findBooking.id,
                    spotId: Number(findBooking.spotId),
                    userId: findBooking.userId,
                    startDate: new Date(findBooking.startDate).toISOString().split('T')[0],
                    endDate: new Date(findBooking.endDate).toISOString().split('T')[0],
                    createdAt,
                    updatedAt
                });
            }
        }
    }
)


//GET ALL OF CURRENT USER BOOKINGS --- COMPLETE
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const usersBookings = await Booking.findAll({
            where: {
                userId: req.user.id
            },
            include: [
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: [
                        {
                            model: SpotImage,
                            where: {
                                preview: true
                            },
                            attributes: ['url']
                        }
                    ]
                }
            ]
        });

        const bookings = [];
                for (let i = 0; i < usersBookings.length; i++) {

                    let splitCreate = usersBookings[i].createdAt.toISOString().split('T').join(' ');
                    let createdAt = splitCreate.split('.')[0];

                    let splitUpdate = usersBookings[i].updatedAt.toISOString().split('T').join(' ');
                    let updatedAt = splitUpdate.split('.')[0];


                    let bookingInfo = {
                        id: usersBookings[i].id,
                        spotId: usersBookings[i].spotId,
                        Spot: {
                            id: usersBookings[i].Spot.id,
                            ownerId: usersBookings[i].Spot.ownerId,
                            address: usersBookings[i].Spot.address,
                            city: usersBookings[i].Spot.city,
                            state: usersBookings[i].Spot.state,
                            country: usersBookings[i].Spot.country,
                            lat: Number(usersBookings[i].Spot.lat),
                            lng: Number(usersBookings[i].Spot.lng),
                            name: usersBookings[i].Spot.name,
                            price: Number(usersBookings[i].Spot.price),
                            previewImage: usersBookings[i].Spot.SpotImages[0].url,
                        },
                        userId: usersBookings[i].userId,
                        startDate: usersBookings[i].startDate.toISOString().split('T')[0],
                        endDate: usersBookings[i].endDate.toISOString().split('T')[0],
                        createdAt,
                        updatedAt
                    }
                    bookings.push(bookingInfo)
                }

        return res.json({
            Bookings: bookings
        });
    }
)

//DELETE A BOOKING --- COMPLETE
router.delete(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const {bookingId} = req.params;

        const deleteBooking = await Booking.findByPk(bookingId);
        console.log(deleteBooking)
        if (!deleteBooking) {
            return res.status(404).json({
                message: "Booking couldn't be found"
            });
        } else {
            const findSpot = await Spot.findByPk(deleteBooking.spotId);
            if (findSpot) {
                if (deleteBooking.userId !== req.user.id && findSpot.ownerId !== req.user.id) {
                    return res.status(403).json({
                        message: "Forbidden"
                    })
                } else if (new Date().toISOString().split('T')[0] >= new Date(deleteBooking.startDate).toISOString().split('T')[0]) {
                    return res.status(403).json({
                        message: "Bookings that have been started can't be deleted"
                    })
                } else {
                    await deleteBooking.destroy();

                    return res.json({
                        message: "Successfully deleted"
                    })
                }
            } else {
                return res.status(404).json({
                    message: "Booking couldn't be found"
                });
            }
        }
    }
)


module.exports = router;
