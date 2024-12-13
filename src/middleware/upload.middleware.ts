import multer, { StorageEngine } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary'; 


const storage: StorageEngine = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let resourceType: 'image' | 'video' | 'raw' = 'raw';

    if (file.mimetype.startsWith('image')) {
      resourceType = 'image';
    } else if (file.mimetype.startsWith('video')) {
      resourceType = 'video';
    }

    return {
      folder: 'uploads/',  
      format: file.mimetype.split('/')[1], 
      resource_type: resourceType,  
    };
  },
});


const upload = multer({ storage: storage });


export default upload;
