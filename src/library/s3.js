const fs = require('fs')
const path = require('path')
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")

const { encrypt } = require('./encryption')

const initializeS3 = () => {
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    })
    return s3
}

const uploadToS3 = async (data) => {
    if (process.env.MODE && process.env.MODE.toLowerCase() === 'development') {
        // write locally into project-root/uploads/<data.filepath>
        const uploadsRoot = path.resolve(__dirname, '..', '..', 'uploads')
        const destPath = path.join(uploadsRoot, data.filepath)
        const destDir = path.dirname(destPath)

        await fs.promises.mkdir(destDir, { recursive: true })
        await fs.promises.writeFile(destPath, data.buffer)

        // Return a lightweight object similar to S3 response for compatibility
        return {
            Location: destPath,
            Bucket: 'local',
            Key: data.filepath
        }
    }

    const s3 = initializeS3()

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: data.filepath,
        Body: data.buffer,
        ContentType: data.mimetype
    })

    const s3Data = await s3.send(command)
    return s3Data
}

const sendFile = async (res, filePath) => {
    try {
        if (process.env.MODE && process.env.MODE.toLowerCase() === 'development') {
            const absPath = path.resolve(__dirname, '..', '..', 'uploads', filePath)
            if (!fs.existsSync(absPath)) {
                throw new Error('File not found')
            }
            const image = fs.readFileSync(absPath);
            const base64Image = Buffer.from(image).toString('base64');
            return res.json(encrypt({
                image: base64Image
            }));
        }
        
        const bucket = process.env.AWS_S3_BUCKET
        const region = process.env.AWS_REGION
        // encode only path segments so spaces and special chars are handled
        const encodedKey = filePath.split('/').map(encodeURIComponent).join('/')
        const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`
        return res.json(encrypt({
            imageUrl: s3Url
        }))
    } catch (error) {
        console.error(error.message, 'Error at sending file from s3')
        return res.status(200).json(encrypt({message: error.message, success: false}))
    }
}

module.exports = { uploadToS3, sendFile }