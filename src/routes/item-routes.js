const express = require("express")
const Joi = require('joi')

const {encrypt} = require("../library/encryption")
const { multerUpload } = require("../library/multer")

const Item = require("../models/items.model")
const { uploadToS3 } = require("../library/s3")

const ItemRoutes = express.Router()

ItemRoutes.post('/api/add-item', multerUpload.single("file"), async (req, res) => {
    try {

        if(!req.file){
            throw new Error('File is required')
        }
        const requestBody = JSON.parse(req.body.body)

        const schema = Joi.object({
            itemName: Joi.string().required(),
            store: Joi.string().required(),
            description: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            category: Joi.string().allow(null),
            brand: Joi.string().allow(null),
            address: Joi.string().required().min(6),
            pincode: Joi.string().required().length(6),
            uploadedBy: Joi.string().required()
        })

        const {error, value: body} = schema.validate(requestBody)
        if(error) {
            console.log(error, 'Error at schema of add item')
            throw new Error(error)
        }

        body.imageName = body.itemName.replaceAll(' ', '_') + '_' + Date.now()
        const file = {
            mimetype: req.file.mimetype,
            filepath: 'items/' + body.imageName,
            buffer: req.file.buffer
        }
        uploadToS3(file)
        await Item.create(body)

        const response = {
            success: true,
            message: 'Item added successfully'
        }

        return res.status(201).json(encrypt(response))

    } catch (error) {
        console.log(error, 'Error at adding item route')
        return res.status(200).json(encrypt({message: error.message, success: false}))
    }
})

module.exports = ItemRoutes