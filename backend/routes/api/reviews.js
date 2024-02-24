const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();


//ADD AN IMAGE TO A REVIEW BASED ON REVIEW ID --- COMPLETE
router.post(
    '/:reviewId/images',
    requireAuth,
    async (req, res) => {
        const {reviewId} = req.params;
        const {url} = req.body;
        const errors = {};

        const findReview = await Review.findOne({
            where: {
                id: reviewId
            }
        });

        if (!findReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        } else if (findReview.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        } else {
            const allReviewImages = await ReviewImage.findAll({
                where: {
                    reviewId
                }
            });

            if (allReviewImages.length >= 10) {
                res.status(403).json({
                    message: "Maximum number of images for this resource was reached"
                })
            } else {
                const newImage = await ReviewImage.create({
                    reviewId,
                    url
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
                    return res.status(200).json({
                        id: newImage.id,
                        url: newImage.url
                    });
                }
            }
        }
    }
)

//EDIT A REVIEW --- COMPLETE
router.put(
    '/:reviewId',
    requireAuth,
    async (req, res) => {
        const {reviewId} = req.params;
        const { review, stars } = req.body;
        const errors = {};

        const updateReview = await Review.findByPk(reviewId);

        if (!updateReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        } else if (updateReview.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            })
        } else {
            await updateReview.update({
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
                let splitCreate = updateReview.createdAt.toISOString().split('T').join(' ');
                let createdAt = splitCreate.split('.')[0];
                let splitUpdate = updateReview.updatedAt.toISOString().split('T').join(' ');
                let updatedAt = splitUpdate.split('.')[0];

                let updatedReview = {
                    id: updateReview.id,
                    userId: updateReview.userId,
                    spotId: updateReview.spotId,
                    review: updateReview.review,
                    stars: updateReview.stars,
                    createdAt,
                    updatedAt
                }

                return res.status(200).json(updatedReview);
            }
        }
    }
)


//GET ALL REVIEWS OF CURRENT USER --- COMPLETE
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const allUserReviews = await Review.findAll({
            where: {
                userId: req.user.id
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: [
                        {
                            model: SpotImage,
                            where: {
                                preview: true
                            },
                            attributes: ['url'],
                        },
                    ],
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        const reviews = [];
                for (let i = 0; i < allUserReviews.length; i++) {

                    let splitCreate = allUserReviews[i].createdAt.toISOString().split('T').join(' ');
                    let createdAt = splitCreate.split('.')[0];

                    let splitUpdate = allUserReviews[i].updatedAt.toISOString().split('T').join(' ');
                    let updatedAt = splitUpdate.split('.')[0];


                    let reviewInfo = {
                        id: allUserReviews[i].id,
                        userId: allUserReviews[i].userId,
                        spotId: allUserReviews[i].spotId,
                        review: allUserReviews[i].review,
                        stars: allUserReviews[i].stars,
                        createdAt,
                        updatedAt,
                        User: allUserReviews[i].User,
                        Spot: {
                            id: allUserReviews[i].Spot.id,
                            ownerId: allUserReviews[i].Spot.ownerId,
                            address: allUserReviews[i].Spot.address,
                            city: allUserReviews[i].Spot.city,
                            state: allUserReviews[i].Spot.state,
                            country: allUserReviews[i].Spot.country,
                            lat: Number(allUserReviews[i].Spot.lat),
                            lng: Number(allUserReviews[i].Spot.lng),
                            name: allUserReviews[i].Spot.name,
                            price: Number(allUserReviews[i].Spot.price),
                            previewImage: allUserReviews[i].Spot.SpotImages[0].url,
                        },
                        ReviewImages: allUserReviews[i].ReviewImages
                    }
                    reviews.push(reviewInfo)
                }

        return res.json({
            Reviews: reviews
        });
    }
)

//DELETE A REVIEW --- COMPLETE
router.delete(
    '/:reviewId',
    requireAuth,
    async (req, res) => {
        const {reviewId} = req.params;

        const deleteReview = await Review.findByPk(reviewId);

        if (!deleteReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        } else if (deleteReview.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        } else {
            await deleteReview.destroy();

            return res.json({
                message: "Successfully deleted"
            })
        }
    }
)


module.exports = router;
