const express = require('express')
const Joi = require('joi')

const { encrypt, decrypt } = require('../library/encryption')

const Brand = require('../models/brands.model')

const BrandRoutes = express.Router()

BrandRoutes.post('/api/get-brands', async (req, res) => {
    const response = {
        success: true,
        data: [],
        message: ''
    }
    try {
        req.body = decrypt(req)
        const schema = Joi.object({
            category: Joi.string().optional().allow(null)
        })
        const {error, value: body} = schema.validate(req.body)
        if(error) {
            throw new Error(error)
        }
        const conditions = {}
        if(body.category) conditions.category = new Types.ObjectId(body.category)
        const brands = await Brand.find(conditions).sort({name: 1})
        response.data = brands
        response.message = 'Brands fetched successfully'
        return res.status(200).json(encrypt(response))
    } catch (error) {
        console.log(error, 'Error at get brands route')
        response.message = error.message
        response.success = false
        return res.status(200).json(encrypt(response))
    }
})

BrandRoutes.post('/api/add-brand', async (req, res) => {
    const response = {
        success: true,
        message: ''
    }
    try {
        req.body = decrypt(req)
        const schema = Joi.object({
            name: Joi.string().required(),
            category: Joi.string().required()
        })
        const {error, value: body} = schema.validate(req.body)
        if(error) {
            throw new Error(error)
        }
        await Brand.create(body)
        response.message = 'Brand added successfully'
        return res.status(201).json(encrypt(response))
    } catch (error) {
        console.log(error, 'Error at add brand route')
        response.message = error.message
        response.success = false
        return res.status(200).json(encrypt(response))
    }
})

module.exports = BrandRoutes