import multer, { StorageEngine } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary'; // Import the cloudinary configuration

// Define the Multer storage using Cloudinary storage engine
const storage: StorageEngine = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Customize this logic based on file type (image, video, document)
    let resourceType: 'image' | 'video' | 'raw' = 'raw';

    if (file.mimetype.startsWith('image')) {
      resourceType = 'image';
    } else if (file.mimetype.startsWith('video')) {
      resourceType = 'video';
    }

    return {
      folder: 'uploads/', // Set the folder where files will be stored in Cloudinary
      format: file.mimetype.split('/')[1], // Format based on file's MIME type
      resource_type: resourceType, // Set resource type
    };
  },
});

// Create the upload middleware using the Cloudinary storage engine
const upload = multer({ storage: storage });

export default upload;
