const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();
//GET ALL SPOTS --- COMPLETE
router.get(
    '/',
    async (req, res) => {
        const query = {};
        const errors = {};
        // console.log('PAGE', req.query.page, typeof req.query.page)
        // console.log('SIZE', req.query.size, typeof req.query.size)
        // console.log('minLat', req.query.minLat, typeof req.query.minLat)
        // console.log('maxLat', req.query.maxLat, typeof req.query.maxLat)
        // console.log('minLng', req.query.minLng, typeof req.query.minLng)
        // console.log('maxLng', req.query.maxLng, typeof req.query.maxLng)
        // console.log('minPrice', req.query.minPrice, typeof req.query.minPrice)
        // console.log('maxPrice', req.query.maxPrice, typeof req.query.maxPrice)

        if (req.query.page === '') {
           req.query.page = 1;
        }

        if (req.query.size === '') {
            req.query.size = 20;
        }

        let page = req.query.page === undefined || null ? 1 : parseInt(req.query.page);
        let size = req.query.size === undefined || null ? 20 : parseInt(req.query.size);

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
            if (isNaN(parseInt(page))) {
                errors.page = "Page must be an integer!"
            } else if (page <= 0) {
                errors.page = "Page must be greater than or equal to 1"
            }

            if (isNaN(parseInt(size))) {
                errors.size = "Size must be an integer!"
            } else if (size <= 0) {
                errors.size = "Size must be greater than or equal to 1"
            }
        }

        const where = {};

        const {maxLat, minLat, maxLng, minLng, maxPrice, minPrice} = req.query;
        if (maxLat) {

            if (isNaN(parseInt(maxLat))) {
                errors.maxLat = "Maximum latitude is invalid"
            } else {
                where.lat = {
                    [Op.lte]: Number(maxLat)
                }
            }
        }

        if (minLat) {

            if (isNaN(parseInt(minLat))) {
                errors.minLat = "Minimum latitude is invalid"
            } else {
                where.lat = {
                    [Op.gte]: Number(minLat)
                }
            }
        }

        if (maxLng) {

            if (isNaN(parseInt(maxLng))) {
                errors.maxLng = "Maximum longitude is invalid"
            } else {
                where.lng = {
                    [Op.lte]: Number(maxLng)
                }
            }
        }

        if (minLng) {

            if (isNaN(parseInt(minLng))) {
                errors.minLng = "Minimum longitude is invalid"
            } else {
                where.lng = {
                    [Op.gte]: Number(minLng)
                }
            }
        }

        if (minPrice && maxPrice) {

            if (!isNaN(parseInt(minPrice)) && !isNaN(parseInt(maxPrice))) {

                if (Number(minPrice) < 0 || Number(maxPrice) < 0) {
                    if (Number(minPrice) < 0) {
                        errors.minPrice = "Minimum price must be greater than or equal to 0"
                    }

                    if (Number(maxPrice) < 0) {
                        errors.maxPrice = "Maximum price must be greater than or equal to 0"
                    }
                } else if (Number(minPrice) > Number(maxPrice)) {
                    errors.price = "Minimum price must be smaller than maximum price"
                } else {
                    where.price = {
                        [Op.between]: [Number(minPrice), Number(maxPrice)]
                    }
                }
            } else {
                if (isNaN(parseInt(maxPrice))) {
                        errors.maxPrice = "Maximum price is invalid"
                } else if (Number(maxPrice) < 0) {
                        errors.maxPrice = "Maximum price must be greater than or equal to 0"
                }

                if (isNaN(parseInt(minPrice))) {
                    errors.minPrice = "Minimum price is invalid"
                } else if (Number(minPrice) < 0) {
                        errors.minPrice = "Minimum price must be greater than or equal to 0"
                }

            }
        } else if (maxPrice) {

            if (isNaN(parseInt(maxPrice))) {
                errors.maxPrice = "Maximum price is invalid"
            } else if (Number(maxPrice) < 0) {
                errors.maxPrice = "Maximum price must be greater than or equal to 0"
            } else {
                where.price = {
                    [Op.lte]: Number(maxPrice)
                }
            }

        } else if (minPrice) {

            if (isNaN(parseInt(minPrice))) {
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
                        attributes: ['stars'],
                        required: false
                    },
                    {
                        model: SpotImage,
                        attributes: ['url'],
                        where: {
                            preview: true
                        },
                        required: false
                    },
                ],
            });

            if (allSpots.length === 0) {
                return res.json({
                    message: "Sorry, we couldn't find any spots matching your search!"
                })
            } else {

                const spots = [];
                for (let i = 0; i < allSpots.length; i++) {
                    let totalRating = 0;
                    let divider;
                    let avgRating;

                    let splitCreate = allSpots[i].createdAt.toISOString().split('T').join(' ');
                    let createdAt = splitCreate.split('.')[0];
                    let splitUpdate = allSpots[i].updatedAt.toISOString().split('T').join(' ');
                    let updatedAt = splitUpdate.split('.')[0];


                    if (allSpots[i].Reviews) {
                        divider = allSpots[i].Reviews.length
                        for (let j = 0; j <= allSpots[i].Reviews.length; j++) {
                            if (allSpots[i].Reviews[j]) {
                                let rating = allSpots[i].Reviews[j].stars;
                                totalRating += rating;
                            }
                        }
                        avgRating = Math.round((totalRating / divider) * 10) / 10;
                    } else {
                        divider = 0;
                        avgRating = 0;
                    }



                    if (!allSpots[i].SpotImages[0]) {
                        let spotInfo = {
                            id: allSpots[i].id,
                            ownerId: allSpots[i].ownerId,
                            address: allSpots[i].address,
                            city: allSpots[i].city,
                            state: allSpots[i].state,
                            country: allSpots[i].country,
                            lat: Number(allSpots[i].lat),
                            lng: Number(allSpots[i].lng),
                            name: allSpots[i].name,
                            description: allSpots[i].description,
                            price: Number(allSpots[i].price),
                            createdAt,
                            updatedAt,
                            avgRating,
                            previewImage: null
                        }
                        spots.push(spotInfo)
                    } else {
                        let spotInfo = {
                            id: allSpots[i].id,
                            ownerId: allSpots[i].ownerId,
                            address: allSpots[i].address,
                            city: allSpots[i].city,
                            state: allSpots[i].state,
                            country: allSpots[i].country,
                            lat: Number(allSpots[i].lat),
                            lng: Number(allSpots[i].lng),
                            name: allSpots[i].name,
                            description: allSpots[i].description,
                            price: Number(allSpots[i].price),
                            createdAt,
                            updatedAt,
                            avgRating,
                            previewImage: allSpots[i].SpotImages[0].url
                        }
                        spots.push(spotInfo)
                    }
                }
                if (req.query.page || req.query.size) {
                    return res.json({
                        Spots: spots,
                        page,
                        size
                    });
                }
                return res.json({
                    Spots: spots
                });
            }
        }
    }
)

//GET ALL SPOTS OWNED BY CURRENT USER --- COMPLETE
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
                    attributes: ['stars'],
                    required: false
                },
                {
                    model: SpotImage,
                    attributes: ['url'],
                    where: {
                        preview: true
                    },
                    required: false
                }
            ],
        });

        const spots = [];
        for (let i = 0; i < allSpots.length; i++) {
            let totalRating = 0;
            let divider;
            let avgRating;
            
            let splitCreate = allSpots[i].createdAt.toISOString().split('T').join(' ');
            let createdAt = splitCreate.split('.')[0];
            let splitUpdate = allSpots[i].updatedAt.toISOString().split('T').join(' ');
            let updatedAt = splitUpdate.split('.')[0];

            if (allSpots[i].Reviews) {
                divider = allSpots[i].Reviews.length
                for (let j = 0; j <= allSpots[i].Reviews.length; j++) {
                    if (allSpots[i].Reviews[j]) {
                        let rating = allSpots[i].Reviews[j].stars;
                        totalRating += rating;
                    }
                }

                avgRating = Math.round((totalRating / divider) * 10) / 10;
            } else {
                divider = 0;
                avgRating = 0;
            }

            if (!allSpots[i].SpotImages[0]) {
                let spotInfo = {
                    id: allSpots[i].id,
                    ownerId: allSpots[i].ownerId,
                    address: allSpots[i].address,
                    city: allSpots[i].city,
                    state: allSpots[i].state,
                    country: allSpots[i].country,
                    lat: Number(allSpots[i].lat),
                    lng: Number(allSpots[i].lng),
                    name: allSpots[i].name,
                    description: allSpots[i].description,
                    price: Number(allSpots[i].price),
                    createdAt,
                    updatedAt,
                    avgRating,
                    previewImage: null
                }
                    spots.push(spotInfo)
            } else {
                let spotInfo = {
                    id: allSpots[i].id,
                    ownerId: allSpots[i].ownerId,
                    address: allSpots[i].address,
                    city: allSpots[i].city,
                    state: allSpots[i].state,
                    country: allSpots[i].country,
                    lat: Number(allSpots[i].lat),
                    lng: Number(allSpots[i].lng),
                    name: allSpots[i].name,
                    description: allSpots[i].description,
                    price: Number(allSpots[i].price),
                    createdAt,
                    updatedAt,
                    avgRating,
                    previewImage: allSpots[i].SpotImages[0].url
                }
                    spots.push(spotInfo)
            }
            }

            return res.json({
                Spots: spots
            });
    }
)

//GET ALL BOOKINGS FOR A SPOT BASED ON SPOT ID --- COMPLETE
router.get(
    '/:spotId/bookings',
    requireAuth,
    async (req, res) => {
        const {spotId} = req.params;

        const findSpot = await Spot.findByPk(spotId);

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

            const bookings = [];
            for (let i = 0; i < findBookings.length; i++) {

                let splitCreate = findBookings[i].createdAt.toISOString().split('T').join(' ');
                let createdAt = splitCreate.split('.')[0];
                let splitUpdate = findBookings[i].updatedAt.toISOString().split('T').join(' ');
                let updatedAt = splitUpdate.split('.')[0];

                let bookingInfo = {
                    User: findBookings[i].User,
                    id: findBookings[i].id,
                    spotId: findBookings[i].spotId,
                    userId: findBookings[i].userId,
                    startDate: findBookings[i].startDate.toISOString().split('T')[0],
                    endDate: findBookings[i].endDate.toISOString().split('T')[0],
                    createdAt,
                    updatedAt
                };

                bookings.push(bookingInfo)
            }

            return res.json({
                Bookings: bookings
            });
        } else {
            const findBookings = await Booking.findAll({
                where: {
                    spotId
                },
                attributes: ['spotId', 'startDate', 'endDate']
            });

            const bookings = [];
            for (let i = 0; i < findBookings.length; i++) {
                let bookingInfo = {
                    spotId: findBookings[i].spotId,
                    startDate: findBookings[i].startDate.toISOString().split('T')[0],
                    endDate: findBookings[i].endDate.toISOString().split('T')[0]
                };

                bookings.push(bookingInfo)
            }

            return res.json({
                Bookings: bookings
            });
        }
    }
)

//GET ALL REVIEWS BY SPOT ID --- COMPLETE
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


//GET ALL SPOTS BY SPOT ID --- COMPLETE
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
            lat: Number(currentSpot.lat),
            lng: Number(currentSpot.lng),
            name: currentSpot.name,
            description: currentSpot.description,
            price: Number(currentSpot.price),
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

//CREATE BOOKING FOR SPOT BASED ON SPOT ID --- COMPLETE
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

                    if ((reqStartDate === currSpotStartDate || reqStartDate === currSpotEndDate) ||
                        (reqStartDate > currSpotStartDate && reqStartDate < currSpotEndDate)) {
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
                let splitCreate = createBooking.createdAt.toISOString().split('T').join(' ');
                let createdAt = splitCreate.split('.')[0];
                let splitUpdate = createBooking.updatedAt.toISOString().split('T').join(' ');
                let updatedAt = splitUpdate.split('.')[0];

                return res.json({
                    id: createBooking.id,
                    spotId: Number(createBooking.spotId),
                    userId: createBooking.userId,
                    startDate: new Date(createBooking.startDate).toISOString().split('T')[0],
                    endDate: new Date(createBooking.endDate).toISOString().split('T')[0],
                    createdAt,
                    updatedAt
                });
            }

        }
    }
)

//CREATE REVIEW FOR SPOT BASED ON SPOT ID --- COMPLETE
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
                        spotId: Number(spotReview.spotId),
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

        console.log(preview)

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
            if (preview === true) {
                console.log(preview)
                const checkSpotImages = await SpotImage.findAll({
                    where: {
                        spotId,
                        preview: true
                    }
                })

                if (checkSpotImages.length > 0) {
                    await checkSpotImages[0].update({
                        preview: false
                    })
                }
            }

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
            lat: Number(newSpot.lat),
            lng: Number(newSpot.lng),
            name: newSpot.name,
            description: newSpot.description,
            price: Number(newSpot.price),
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
                    lat: Number(updateSpot.lat),
                    lng: Number(updateSpot.lng),
                    name: updateSpot.name,
                    description: updateSpot.description,
                    price: Number(updateSpot.price),
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
