const express = require("express")
const Joi = require("joi")
const { Types } = require("mongoose")

const { jwtAuth } = require("../middlewares/auth")

const { decrypt, encrypt } = require("../library/encryption")

const Item = require("../models/items.model")

const ProfileRoutes = express.Router()

ProfileRoutes.get('/api/profile/items/data', jwtAuth, async (req, res) => {
    try {
        console.log(req)
        const { UID } = req.user
        const data = await Item.aggregate([
            {
                $match: { addedBy: new Types.ObjectId(UID) }
            }, {
                $group: {
                    _id: '$addedBy',
                    items_count: { $count: {} },
                    items_likes: { $sum: '$likes' }
                }
            }
        ])

        console.log(UID, data)

        const response = {
            success: true,
            message: 'Profile data fetched successfully',
            data: data[0]
        }

        return res.status(200).json(encrypt(response))

    } catch (error) {
        console.log('Error at fetching profile data', error)
        return res.status(200).json(encrypt({success: false, error : error.message}))
    }
})

module.exports = ProfileRoutes