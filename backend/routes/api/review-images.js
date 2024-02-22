const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();


//DELETE A REVIEW IMAGE --- NOT COMPLETE
router.delete(
    '/:imageId',
    requireAuth,
    async (req, res) => {
        const {imageId} = req.params;

        const deleteImage = await ReviewImage.findByPk(imageId);

        if (!deleteImage) {
            return res.status(404).json({
                message: "Review Image couldn't be found"
            });
        } else {
            const findReview = await Review.findByPk(deleteImage.reviewId);

            if (findReview.userId !== req.user.id) {
                return res.status(403).json({
                    message: "Forbidden"
                });
            } else {
                await deleteImage.destroy();

                return res.json({
                    message: "Successfully deleted"
                });
            }
        }
    }
)

module.exports = router;
