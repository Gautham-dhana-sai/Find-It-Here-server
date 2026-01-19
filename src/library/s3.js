const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")

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

module.exports = { uploadToS3 }