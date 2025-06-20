require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars', // Thư mục lưu trữ trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'], // Định dạng ảnh được phép
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Chỉnh kích thước ảnh
    }
});

module.exports = { 
    cloudinary,
    storage
};
