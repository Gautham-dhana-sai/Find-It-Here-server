const express = require('express')
const { sendFile } = require('../library/s3')

const FileRoutes = express.Router()

FileRoutes.get('/api/get-file', async (req, res) => {   
    try {
        const filePath = req.query.filePath
        if(!filePath) {
            throw new Error('filePath query parameter is required')
        }

        // Delegate serving to library helper which handles dev vs prod
        return await sendFile(res, filePath)
    } catch (error) {
        console.log(error, 'Error at get file route')
        return res.status(200).json({message: error.message, success: false})
    }
})

module.exports = FileRoutes