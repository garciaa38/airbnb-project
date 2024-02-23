const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();
//GET ALL SPOTS --- NOT COMPLETE
//--- Still need to add AVGRATING and PREVIEWIMAGE to Spots table
router.get(
    '/',
    async (req, res) => {
        const query = {};
        const errors = {};

        let page = req.query.page === undefined ? 1 : parseInt(req.query.page);
        let size = req.query.size === undefined ? 20 : parseInt(req.query.size);

        if (isNaN(page)) {
            errors.page = "Page query is invalid"
        }

        if (isNaN(size)) {
            errors.size = "Size query is invalid"
        }

        if (page > 10) {
            page = 10;
        }

        if (size > 20) {
            size = 20;
        }

        if (page >= 1 && size >= 1) {
            query.limit = size;
            query.offset = size * (page - 1);
        } else {
            if (page <= 0) {
                errors.page = "Page must be greater than or equal to 1"
            }

            if (size <= 0) {
                errors.size = "Size must be great than or equal to 1"
            }
        }

        const where = {};

        const {maxLat, minLat, maxLng, minLng, maxPrice, minPrice} = req.query;

        if (maxLat) {
            if (Number(maxLat) > 90 ||
            isNaN(Number(maxLat))) {
                errors.maxLat = "Maximum latitude is invalid"
            } else {
                where.lat = {
                    [Op.lte]: Number(maxLat)
                }
            }
        }

        if (minLat) {
            if (Number(minLat) < -90 ||
            isNaN(Number(minLat))) {
                errors.minLat = "Minimum latitude is invalid"
            } else {
                where.lat = {
                    [Op.gte]: Number(minLat)
                }
            }
        }

        if (maxLng) {
            if (Number(maxLng) > 180 ||
            isNaN(Number(maxLng))) {
                errors.maxLng = "Maximum longitude is invalid"
            } else {
                where.lng = {
                    [Op.lte]: Number(maxLng)
                }
            }
        }

        if (minLng) {
            if (Number(minLng) < -180 ||
            isNaN(Number(minLng))) {
                errors.minLng = "Minimum longitude is invalid"
            } else {
                where.lng = {
                    [Op.gte]: Number(minLng)
                }
            }
        }

        if (maxPrice) {
            if (isNaN(Number(maxPrice))) {
                errors.maxPrice = "Maximum price is invalid"
            } else if (Number(maxPrice) < 0) {
                errors.maxPrice = "Maximum price must be greater than or equal to 0"
            } else {
                where.price = {
                    [Op.lte]: Number(maxPrice)
                }
            }
        }

        if (minPrice) {
            if (isNaN(Number(minPrice))) {
                errors.minPrice = "Minimum price is invalid"
            } else if (Number(minPrice) < 0) {
                errors.minPrice = "Minimum price must be greater than or equal to 0"
            } else {
                where.price = {
                    [Op.gte]: Number(minPrice)
                }
            }
        }


        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message : "Bad Request",
                errors: errors
            })
        } else {
            const allSpots = await Spot.findAll({
                where,
                ...query,
                include: [
                    {
                        model: Review,
                        attributes: ['stars']
                    },
                    {
                        model: SpotImage,
                        attributes: ['url'],
                        where: {
                            preview: true
                        }
                    }
                ],

                // attributes: [
                //     [sequelize.fn('AVG', sequelize.col('Review.stars')), 'avgRating']
                // ],

                // group: ['Spot.id'],
                //raw: true
            });

            if (allSpots.length === 0) {
                return res.json({
                    message: "Sorry, we couldn't find any spots matching your search!"
                })
            } else {

                const spots = [];
                for (let i = 0; i < allSpots.length; i++) {
                    let totalRating = 0;
                    let divider = allSpots[i].Reviews.length
                    for (let j = 0; j < allSpots[i].Reviews.length; j++) {
                        let rating = allSpots[i].Reviews[j].stars;
                        totalRating += rating;
                    }
                    let avgRating = Math.round((totalRating / divider) * 10) / 10;


                    let splitCreate = allSpots[i].createdAt.toISOString().split('T').join(' ');
                    let createdAt = splitCreate.split('.')[0];

                    let splitUpdate = allSpots[i].updatedAt.toISOString().split('T').join(' ');
                    let updatedAt = splitUpdate.split('.')[0];


                    let spotInfo = {
                        id: allSpots[i].id,
                        ownerId: allSpots[i].ownerId,
                        address: allSpots[i].address,
                        city: allSpots[i].city,
                        state: allSpots[i].state,
                        country: allSpots[i].country,
                        lat: allSpots[i].lat,
                        lng: allSpots[i].lng,
                        name: allSpots[i].name,
                        description: allSpots[i].description,
                        price: allSpots[i].price,
                        createdAt,
                        updatedAt,
                        avgRating,
                        previewImage: allSpots[i].SpotImages[0].url
                    }
                    spots.push(spotInfo)
                }

                return res.json({
                    Spots: spots
                });
            }
        }
    }
)

//GET ALL SPOTS OWNED BY CURRENT USER --- NOT COMPLETE
//--- Still need to add AVGRATING and PREVIEWIMAGE to Spots table
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const allSpots = await Spot.findAll({
            where: {
                ownerId: req.user.id
            },
            include: [
                {
                    model: Review,
                    attributes: ['stars']
                },
                {
                    model: SpotImage,
                    attributes: ['url'],
                    where: {
                        preview: true
                    }
                }
            ],
        });

        const spots = [];
        for (let i = 0; i < allSpots.length; i++) {
            let totalRating = 0;
            let divider = allSpots[i].Reviews.length
            for (let j = 0; j < allSpots[i].Reviews.length; j++) {
                let rating = allSpots[i].Reviews[j].stars;
                totalRating += rating;
            }
            let avgRating = Math.round((totalRating / divider) * 10) / 10;
            let splitCreate = allSpots[i].createdAt.toISOString().split('T').join(' ');
            let createdAt = splitCreate.split('.')[0];
            let splitUpdate = allSpots[i].updatedAt.toISOString().split('T').join(' ');
            let updatedAt = splitUpdate.split('.')[0];
            let spotInfo = {
                id: allSpots[i].id,
                ownerId: allSpots[i].ownerId,
                address: allSpots[i].address,
                city: allSpots[i].city,
                state: allSpots[i].state,
                country: allSpots[i].country,
                lat: allSpots[i].lat,
                lng: allSpots[i].lng,
                name: allSpots[i].name,
                description: allSpots[i].description,
                price: allSpots[i].price,
                createdAt,
                updatedAt,
                avgRating,
                previewImage: allSpots[i].SpotImages[0].url
            }
                spots.push(spotInfo)
            }

            return res.json({
                Spots: spots
            });
    }
)

//GET ALL BOOKINGS FOR A SPOT BASED ON SPOT ID --- NOT COMPLETE
router.get(
    '/:spotId/bookings',
    requireAuth,
    async (req, res) => {
        const {spotId} = req.params;

        const findSpot = await Spot.findByPk(spotId);

        console.log(findSpot)

        if (!findSpot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        } else if (findSpot.ownerId === req.user.id) {
            const findBookings = await Booking.findAll({
                where: {
                    spotId
                },
                include: {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            });

            return res.json(findBookings);
        } else {
            const findBookings = await Booking.findAll({
                where: {
                    spotId
                },
                attributes: ['spotId', 'startDate', 'endDate']
            });

            return res.json(findBookings);
        }
    }
)

//GET ALL REVIEWS BY SPOT ID --- NOT COMPLETE
//--- Still need to test with ReviewImages and complete Spot table
router.get(
    '/:spotId/reviews',
    async (req, res) => {
        const {spotId} = req.params;

        const findSpot = await Spot.findByPk(spotId);

        const spotReviews = await Review.findAll({
            where:{
                spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        if (!findSpot) {
            return res.status(404).json({
                "message": "Spot couldn't be found"
            });
        } else if (spotReviews.length === 0){
            return res.json({
                "message": "Be the first to leave a review for this spot!"
            });
        } else {
            const reviews = [];
                for (let i = 0; i < spotReviews.length; i++) {

                    let splitCreate = spotReviews[i].createdAt.toISOString().split('T').join(' ');
                    let createdAt = splitCreate.split('.')[0];

                    let splitUpdate = spotReviews[i].updatedAt.toISOString().split('T').join(' ');
                    let updatedAt = splitUpdate.split('.')[0];


                    let reviewInfo = {
                        id: spotReviews[i].id,
                        userId: spotReviews[i].userId,
                        spotId: spotReviews[i].spotId,
                        review: spotReviews[i].review,
                        stars: spotReviews[i].stars,
                        createdAt,
                        updatedAt,
                        User: spotReviews[i].User,
                        ReviewImages: spotReviews[i].ReviewImages
                    }
                    reviews.push(reviewInfo)
                }

            return res.json({
                Reviews: reviews
            });

        }

    }
)


//GET ALL SPOTS BY SPOT ID --- NOT COMPLETE
//--- Still need to add AVGRATING, PREVIEWIMAGE, and NUMREVIEWS to Spots table
router.get(
   '/:spotId',
   async (req, res) => {
    const {spotId} = req.params;

    const currentSpot = await Spot.findOne({
        where: {
            id: spotId
        },
        include:  [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                as: 'Owner'
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: Review,
                attributes: ['stars']
            }
        ]
    });

    if (!currentSpot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    } else {
        let totalRating = 0;
        let divider = currentSpot.Reviews.length
        for (let i = 0; i < currentSpot.Reviews.length; i++) {
            let rating = currentSpot.Reviews[i].stars;
            totalRating += rating
        }
        let avgRating = Math.round((totalRating / divider) * 10) / 10;
        let splitCreate = currentSpot.createdAt.toISOString().split('T').join(' ');
        let createdAt = splitCreate.split('.')[0];
        let splitUpdate = currentSpot.updatedAt.toISOString().split('T').join(' ');
        let updatedAt = splitUpdate.split('.')[0];
        let spotInfo = {
            id: currentSpot.id,
            ownerId: currentSpot.ownerId,
            address: currentSpot.address,
            city: currentSpot.city,
            state: currentSpot.state,
            country: currentSpot.country,
            lat: currentSpot.lat,
            lng: currentSpot.lng,
            name: currentSpot.name,
            description: currentSpot.description,
            price: currentSpot.price,
            createdAt,
            updatedAt,
            numReviews: divider,
            avgStarRating: avgRating,
            SpotImages: currentSpot.SpotImages,
            Owner: currentSpot.Owner
        }


        return res.json(spotInfo);
    }


   }
)

//CREATE BOOKING FOR SPOT BASED ON SPOT ID --- NOT COMPLETE
router.post(
    '/:spotId/bookings',
    requireAuth,
    async (req, res) => {
        const {spotId} = req.params;
        const { startDate, endDate } = req.body;
        const errors = {};
        const findSpot = await Spot.findByPk(spotId);

        if (!findSpot) {
            res.status(404).json({
                message: "Spot couldn't be found"
            });
        } else if (findSpot.ownerId === req.user.id) {
            res.status(403).json({
                message: "Forbidden"
            })
        } else {
            const currSpotBookings = await Booking.findAll({
                where: {
                    spotId
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

            const createBooking = await Booking.create({
                userId: req.user.id,
                spotId,
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
                    id: createBooking.id,
                    userId: createBooking.userId,
                    spotId: Number(createBooking.spotId),
                    startDate: new Date(createBooking.startDate).toISOString().split('T')[0],
                    endDate: new Date(createBooking.endDate).toISOString().split('T')[0],
                    updatedAt: createBooking.updatedAt,
                    createdAt: createBooking.createdAt
                });
            }

        }
    }
)

//CREATE REVIEW FOR SPOT BASED ON SPOT ID --- NOT COMPLETE
router.post(
    '/:spotId/reviews',
    requireAuth,
    async (req, res) => {
        const {spotId} = req.params;
        const {review, stars} = req.body;
        const errors = {};

        const findSpot = await Spot.findByPk(spotId);

        if (!findSpot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        } else {

            const findUserReview = await Review.findOne({
                where: {
                    userId: req.user.id,
                    spotId
                }
            })

            if (findUserReview) {
                return res.status(500).json({
                    message: "User already has a review for this spot"
                })
            } else {
                const spotReview = await Review.create({
                    userId: req.user.id,
                    spotId,
                    review,
                    stars
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
                    let splitCreate = spotReview.createdAt.toISOString().split('T').join(' ');
                    let createdAt = splitCreate.split('.')[0];

                    let splitUpdate = spotReview.updatedAt.toISOString().split('T').join(' ');
                    let updatedAt = splitUpdate.split('.')[0];

                    const newReview = {
                        id: spotReview.id,
                        userId: spotReview.userId,
                        spotId: spotReview.spotId,
                        review: spotReview.review,
                        stars: spotReview.stars,
                        createdAt,
                        updatedAt
                    }

                    return res.status(201).json(newReview);
                }
            }
        }
    }
)

//ADD IMAGE TO A SPOT BASED ON SPOT ID --- COMPLETE
router.post(
    '/:spotId/images',
    requireAuth,
    async (req, res) => {
        const {spotId} = req.params;
        const {url, preview} = req.body;

        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).send({
                "message": "Spot couldn't be found"
            })
        } else if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        } else {
            const newSpotImage = await SpotImage.create({
                spotId,
                url,
                preview
            })

            const result = {
                id: newSpotImage.id,
                url,
                preview
            }

            return res.json(result);
        }



    }
)



//CREATE A SPOT --- COMPLETE
router.post(
    '/',
    requireAuth,
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const errors = {};

        const newSpot = await Spot.create({ ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price })
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
        }

        let splitCreate = newSpot.createdAt.toISOString().split('T').join(' ');
        let createdAt = splitCreate.split('.')[0];

        let splitUpdate = newSpot.updatedAt.toISOString().split('T').join(' ');
        let updatedAt = splitUpdate.split('.')[0];

        const result = {
            id: newSpot.id,
            ownerId: newSpot.ownerId,
            address: newSpot.address,
            city: newSpot.city,
            state: newSpot.state,
            country: newSpot.country,
            lat: newSpot.lat,
            lng: newSpot.lng,
            name: newSpot.name,
            description: newSpot.description,
            price: newSpot.price,
            createdAt,
            updatedAt
        }

        return res.status(201).json(result);
    }
)

//EDIT A SPOT --- COMPLETE
router.put(
    '/:spotId',
    requireAuth,
    async (req, res) => {
        const {spotId} = req.params;
        const { address, city, state, country, lat, lng, name, description, price} = req.body;
        const errors = {};

        const updateSpot = await Spot.findByPk(spotId);

        if (!updateSpot) {
            return res.status(404).send({
                "message": "Spot couldn't be found"
            })
        } else if (updateSpot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        } else {
            await updateSpot.update({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price
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
                let splitCreate = updateSpot.createdAt.toISOString().split('T').join(' ');
                let createdAt = splitCreate.split('.')[0];

                let splitUpdate = updateSpot.updatedAt.toISOString().split('T').join(' ');
                let updatedAt = splitUpdate.split('.')[0];

                const result = {
                    id: updateSpot.id,
                    ownerId: updateSpot.ownerId,
                    address: updateSpot.address,
                    city: updateSpot.city,
                    state: updateSpot.state,
                    country: updateSpot.country,
                    lat: updateSpot.lat,
                    lng: updateSpot.lng,
                    name: updateSpot.name,
                    description: updateSpot.description,
                    price: updateSpot.price,
                    createdAt,
                    updatedAt
                }

                return res.json(result);
            }

        }

    }
)

//DELETE A SPOT --- COMPLETE
router.delete(
    '/:spotId',
    requireAuth,
    async (req, res) => {
        const {spotId} = req.params;

        const deleteSpot = await Spot.findByPk(spotId);

        if (!deleteSpot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        } else if (deleteSpot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        } else {
            await deleteSpot.destroy();

            return res.json({
                "message": "Successfully deleted"
            })
        }
    }
)

module.exports = router;
