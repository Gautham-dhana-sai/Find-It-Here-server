const express = require("express")
const Joi = require('joi')

const {encrypt, decrypt} = require("../library/encryption")
const { uploadToS3 } = require("../library/s3")

const { multerUpload } = require("../middlewares/multer")
const { jwtAuth } = require("../middlewares/auth")

const Item = require("../models/items.model")

const path = require('path')
const ItemRoutes = express.Router()

ItemRoutes.post('/api/add-item', jwtAuth, multerUpload.single("file"), async (req, res) => {
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
        body.addedBy = req.user.UID
        body.likes = 0
        // preserve original file extension when storing locally
        let ext = path.extname(req.file.originalname || '')
        if (!ext) {
            // fallback mapping for common image types
            const mimeMap = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' }
            ext = mimeMap[req.file.mimetype] || ''
        }

        const filename = body.imageName + ext
        // store imageName with extension so later retrieval can use it directly
        body.imageName = filename

        const file = {
            mimetype: req.file.mimetype,
            filepath: 'items/' + filename,
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

ItemRoutes.post('/api/get-items/paginate', async (req, res) => {
    try {
        req.body = decrypt(req)
        const schema = Joi.object({
            paginationCursor: Joi.string().required().allow(null),
            limit: Joi.number().required()
        })
        const {error, value: body} = schema.validate(req.body)
        if(error) {
            throw new Error(error)
        }

        const conditions = {}
        if(body.paginationCursor) conditions._id = {$lt: body.paginationCursor}

        const items = await Item.find(conditions).sort({createdAt: -1}).limit(body.limit)
        const response = {
            success: true, data: items
        }
        return res.status(200).json(encrypt(response))
    } catch (error) {
        console.log(error, 'Error at getting items paginated')
        return res.json(200).json(encrypt({success: false, data: []}))
    }
})

module.exports = ItemRoutes