const express = require('express')
const Joi = require('joi')

const { encrypt, decrypt } = require('../library/encryption')

const Category = require('../models/categories.model')

const CategoryRoutes = express.Router()

CategoryRoutes.get('/api/get-categories', async (req, res) => {
    const response = {
        success: true,
        data: [],
        message: ''
    }
    try {
        const categories = await Category.find({}).sort({name: 1})
        response.data = categories
        response.message = 'Categories fetched successfully'
        return res.status(200).json(encrypt(response))
    } catch (error) {
        console.log(error, 'Error at get categories route')
        response.message = error.message
        response.success = false
        return res.status(200).json(encrypt(response))
    }
})

CategoryRoutes.post('/api/add-category', async (req, res) => {
    const response = {
        success: true,
        message: ''
    }
    try {
        req.body = decrypt(req)
        const schema = Joi.object({
            name: Joi.string().required(),
            parent_category: Joi.string().optional().allow(null)
        })
        const {error, value: body} = schema.validate(req.body)
        if(error) {
            throw new Error(error)
        }
        await Category.create(body)
        response.message = 'Category added successfully'
        return res.status(201).json(encrypt(response))
    } catch (error) {
        console.log(error, 'Error at add category route')
        response.message = error.message
        response.success = false
        return res.status(200).json(encrypt(response))
    }
})

module.exports = CategoryRoutes