const NoticeModel = require('../Models/notice');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const config = require('../config');

cloudinary.config({
  cloud_name: config.CLOUDINARY_CONFIG.CLOUD_NAME,
  api_key: config.CLOUDINARY_CONFIG.API_KEY,
  api_secret: config.CLOUDINARY_CONFIG.API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'notices',
    allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    resource_type: 'auto' 
  }
});


const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
});


const createNotice = async (req, res) => {
  try {
    
    const adminId = req.userId; 
    
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized: Admin ID not found' });
    }

    
    const {
      title,
      content,
      category = 'General',
      isImportant = false
    } = req.body;

    
    // let expiryDate;
    // if (req.body.expiryDate) {
    //   expiryDate = new Date(req.body.expiryDate);
     
    //   if (isNaN(expiryDate.getTime())) {
    //     return res.status(400).json({ message: 'Invalid expiry date format' });
    //   }
    // }

   
    const noticeData = {
      title,
      content,
      CreaterId: adminId,
      category,
      isImportant: isImportant === 'true' || isImportant === true
    };

    
    if (req.file) {
      noticeData.fileUrl = req.file.path; 
      
      
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
      if (['pdf'].includes(fileExtension)) {
        noticeData.fileType = 'pdf';
      } else if (['doc', 'docx'].includes(fileExtension)) {
        noticeData.fileType = 'doc';
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        noticeData.fileType = 'image';
      } else {
        noticeData.fileType = 'other';
      }
    }

   
    if (expiryDate) {
      noticeData.expiryDate = expiryDate;
    }

    
    const newNotice = new NoticeModel(noticeData);
    await newNotice.save();

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      notice: newNotice
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create notice',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  createNotice
};