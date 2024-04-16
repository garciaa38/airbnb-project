const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

//UPDATE A SPOT IMAGE
router.put(
    '/:imageId',
    requireAuth,
    async (req, res) => {
        const {imageId} = req.params;
        const {url, preview} = req.body;
        const errors = {};

        const updateImage = await SpotImage.findByPk(imageId);

        if (!updateImage) {
            return res.status(404).send({
                "message": "Spot Image couldn't be found"
            })
        } else {
            await updateImage.update({
                url,
                preview
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
                const result = {
                    id: updateImage.id,
                    url: updateImage.url,
                    preview: updateImage.preview
                }

                return res.json(result);
            }
        }
    }
)

//DELETE A SPOT IMAGE --- COMPLETE
router.delete(
    '/:imageId',
    requireAuth,
    async (req, res) => {
        const {imageId} = req.params;

        const deleteImage = await SpotImage.findByPk(imageId);

        if (!deleteImage) {
            return res.status(404).json({
                message: "Spot Image couldn't be found"
            });
        } else {
            const findSpot = await Spot.findByPk(deleteImage.spotId);

            if (findSpot.ownerId !== req.user.id) {
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
