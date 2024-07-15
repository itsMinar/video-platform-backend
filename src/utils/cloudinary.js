const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // file has been uploaded successfully
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation got failed

    return null;
  }
};

const deleteVideoFromCloudinary = async (videoId) => {
  try {
    const response = await cloudinary.api.delete_resources([videoId], {
      type: 'upload',
      resource_type: 'video',
    });

    return response;
  } catch (error) {
    console.log('🚀 ~ deleteVideoFromCloudinary ~ error:', error);

    throw new Error('Failed to delete video from Cloudinary');
  }
};

const deleteImageFromCloudinary = async (imageId) => {
  try {
    const response = await cloudinary.api.delete_resources([imageId], {
      type: 'upload',
      resource_type: 'image',
    });

    return response;
  } catch (error) {
    console.log('🚀 ~ deleteImageFromCloudinary ~ error:', error);

    throw new Error('Failed to delete image from Cloudinary');
  }
};

module.exports = {
  uploadOnCloudinary,
  deleteVideoFromCloudinary,
  deleteImageFromCloudinary,
};
