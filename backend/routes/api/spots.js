const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get(
    '/',
    async (req, res) => {
        const allSpots = await Spot.findAll();

        return res.json(allSpots);
    }
)

router.get(
    '/current',
    async (req, res) => {
        console.log(req.user.id);

        const allUsersSpots = await Spot.findAll({
            where: {
                ownerId: req.user.id
            }
        });

        return res.json(allUsersSpots);
    }
)

router.get(
   '/:spotId',
   async (req, res) => {
    const {spotId} = req.params;

    const currentSpot = await Spot.findByPk(spotId);

    return res.json(currentSpot);

   }
)

router.post(
    '/:spotId/images',
    async (req, res) => {
        const {spotId} = req.params;
        const {url, preview} = req.body;

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
)

router.post(
    '/',
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({ ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price });

        return res.json(newSpot);
    }
)

router.put(
    '/:spotId',
    async (req, res) => {
        const {spotId} = req.params;
        const { address, city, state, country, lat, lng, name, description, price} = req.body;

        const updateSpot = await Spot.findByPk(spotId);

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

        return res.json(updateSpot);
    }
)

router.delete(
    '/:spotId',
    async (req, res) => {
        const {spotId} = req.params;

        const deleteSpot = await Spot.findByPk(spotId);

        await deleteSpot.destroy();

        return res.json({
            "message": "Successfully deleted"
        })
    }
)

module.exports = router;
