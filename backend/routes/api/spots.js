const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');

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
    '/',
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({ address, city, state, country, lat, lng, name, description, price });

        return res.json(newSpot);
    }
)

module.exports = router;
