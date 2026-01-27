const express = require("express")
const { jwtAuth } = require("../library/auth")
const { decrypt, encrypt } = require("../library/encryption")
const Joi = require("joi")
const Item = require("../models/items.model")
const { Types } = require("mongoose")

const ProfileRoutes = express.Router()

ProfileRoutes.post('/api/profile/items/data', jwtAuth, async (req, res) => {
    try {
        req.body = decrypt(req)
        const schema = Joi.object({
            user: Joi.string().length(24).required()
        })

        const {error, value: body } = schema.validate(req.body)
        if(error) {
            throw new Error(error)
        }

        const data = await Item.aggregate([
            {
                $match: { addedBy: new Types.ObjectId(body.user) }
            }, {
                $group: {
                    _id: '$addedBy',
                    items_count: { $count: {} },
                    items_likes: { $sum: '$likes' }
                }
            }
        ])

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