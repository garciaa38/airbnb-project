const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();
//GET ALL SPOTS --- NOT COMPLETE
//--- Still need to add AVGRATING and PREVIEWIMAGE to Spots table
router.get(
    '/',
    async (req, res) => {
        const allSpots = await Spot.findAll();

        return res.json(allSpots);
    }
)

//GET ALL SPOTS OWNED BY CURRENT USER --- NOT COMPLETE
//--- Still need to add AVGRATING and PREVIEWIMAGE to Spots table
router.get(
    '/current',
    requireAuth,
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
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
            as: 'Owner'
        }
    });

    if (!currentSpot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    };

    return res.json(currentSpot);

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
            res.status(404).send({
                "message": "Spot couldn't be found"
            })
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

        return res.status(201).json(newSpot);
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
            res.status(404).send({
                "message": "Spot couldn't be found"
            })
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
            }

            return res.json(updateSpot);
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
            res.status(404).send({
                "message": "Spot couldn't be found"
            })
        } else {
            await deleteSpot.destroy();

            return res.json({
                "message": "Successfully deleted"
            })
        }
    }
)

module.exports = router;
