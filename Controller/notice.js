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
    resource_type: (req, file) => {
      const extension = file.originalname.split('.').pop().toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(extension)) {
        return 'raw';
      }
      return 'image';
    },
    
    public_id: (req, file) => {
      const name = file.originalname.split('.')[0];
      return `${name}-${Date.now()}`;
    }
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

    const noticeData = {
      title,
      content,
      CreaterId: adminId,
      category,
      isImportant: isImportant === 'true' || isImportant === true,
      files: [] 
    };

 
    if (req.files && req.files.length > 0) {
      noticeData.files = req.files.map(file => {
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        let fileType = 'other';
        
        if (['pdf'].includes(fileExtension)) {
          fileType = 'pdf';
        } else if (['doc', 'docx'].includes(fileExtension)) {
          fileType = 'doc';
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          fileType = 'image';
        }
        
        return {
          url: file.secure_url || file.url || file.path,
          fileType: fileType,
          originalName: file.originalname
        };
      });
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

const updateNotices = async (req, res) => {
  try {
    const userId = req.userId;
    const noticeId = req.params.id;
    
    if (!noticeId) {
      return res.status(400).json({ 
        message: "Invalid input. Notice ID required" 
      });
    }

    
    const existingNotice = await NoticeModel.findOne({ _id: noticeId, CreaterId: userId });
    
    if (!existingNotice) {
      return res.status(404).json({ 
        message: "Notice not found or not authorized to update" 
      });
    }
    
    const updateFields = {};
    
    if (req.body.title !== undefined) updateFields.title = req.body.title;
    if (req.body.content !== undefined) updateFields.content = req.body.content;
    if (req.body.category !== undefined) updateFields.category = req.body.category;
    if (req.body.isImportant !== undefined) updateFields.isImportant = req.body.isImportant;
    
   
    if (req.files && req.files.length > 0) {
      
      let existingFiles = existingNotice.files || [];
     
    if (req.body.keepFiles && Array.isArray(req.body.keepFiles)) {
  
      const filesToRemove = existingFiles.filter(file => 
            !req.body.keepFiles.includes(file._id.toString())
          );
  
  
     for (const file of filesToRemove) {
    try {
      const publicId = file.url.split('/').pop().split('.')[0];
      if (publicId) {
        const resourceType = file.fileType === 'image' ? 'image' : 'raw';
        await cloudinary.uploader.destroy(`notices/${publicId}`, { resource_type: resourceType });
        console.log(`Deleted file from Cloudinary: ${publicId}`);
      }
    } catch (cloudinaryError) {
      console.error('Error deleting file from Cloudinary:', cloudinaryError);
    }
  }
      existingFiles = existingFiles.filter(file =>
       req.body.keepFiles.includes(file._id.toString())
       );
       }
      
       else if (req.body.removeAllFiles === 'true') {
        for (const file of existingFiles) {
          try {
            const publicId = file.url.split('/').pop().split('.')[0];
            if (publicId) {
              const resourceType = file.fileType === 'image' ? 'image' : 'raw';
              await cloudinary.uploader.destroy(`notices/${publicId}`, { resource_type: resourceType });
            }
          } catch (cloudinaryError) {
            console.error('Error deleting file from Cloudinary:', cloudinaryError);
          }
        }
        existingFiles = [];
      }
      
      
      const newFiles = req.files.map(file => {
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        let fileType = 'other';
        
        if (['pdf'].includes(fileExtension)) {
          fileType = 'pdf';
        } else if (['doc', 'docx'].includes(fileExtension)) {
          fileType = 'doc';
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          fileType = 'image';
        }
        
        return {
          url: file.secure_url || file.url || file.path,
          fileType: fileType,
          originalName: file.originalname,
          uploadedAt: new Date()
        };
      });
      
     
      updateFields.files = [...existingFiles, ...newFiles];
    } else if (req.body.keepFiles && Array.isArray(req.body.keepFiles)) {
      
      const existingFiles = existingNotice.files || [];
      const filesToKeep = existingFiles.filter(file => 
        req.body.keepFiles.includes(file._id.toString())
      );
      
     
      const filesToDelete = existingFiles.filter(file => 
        !req.body.keepFiles.includes(file._id.toString())
      );
      
      for (const file of filesToDelete) {
        try {
          const publicId = file.url.split('/').pop().split('.')[0];
          if (publicId) {
            const resourceType = file.fileType === 'image' ? 'image' : 'raw';
            await cloudinary.uploader.destroy(`notices/${publicId}`, { resource_type: resourceType });
          }
        } catch (cloudinaryError) {
          console.error('Error deleting file from Cloudinary:', cloudinaryError);
        }
      }
      
      updateFields.files = filesToKeep;
    } else if (req.body.removeAllFiles === 'true') {
     
      const existingFiles = existingNotice.files || [];
      
     
      for (const file of existingFiles) {
        try {
          const publicId = file.url.split('/').pop().split('.')[0];
          if (publicId) {
            const resourceType = file.fileType === 'image' ? 'image' : 'raw';
            await cloudinary.uploader.destroy(`notices/${publicId}`, { resource_type: resourceType });
          }
        } catch (cloudinaryError) {
          console.error('Error deleting file from Cloudinary:', cloudinaryError);
        }
      }
      
      updateFields.files = [];
    }
    
    updateFields.updatedAt = Date.now();
    
    const updatedNotice = await NoticeModel.findOneAndUpdate(
      { _id: noticeId, CreaterId: userId },
      updateFields,
      { new: true }
    );
    
    res.json({
      success: true,
      message: "Notice updated successfully",
      notice: updatedNotice
    });
  } catch (error) {
    console.error('Notice update error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error updating notice",
      error: error.message 
    });
  }
};


const deleteNotices = async(req, res) => {
  try {
    const userId = req.userId;
    const noticeId = req.params.id;
    
    const notice = await NoticeModel.findOne({ _id: noticeId, CreaterId: userId });
    
    if (!notice) {
      return res.status(404).json({ 
        success: false,
        message: "Notice not found or not authorized to delete" 
      });
    }
    
    
    if (notice.files && notice.files.length > 0) {
      for (const file of notice.files) {
        try {
          const publicId = file.url.split('/').pop().split('.')[0];
          if (publicId) {
            const resourceType = file.fileType === 'image' ? 'image' : 'raw';
            await cloudinary.uploader.destroy(`notices/${publicId}`, { resource_type: resourceType });
          }
        } catch (cloudinaryError) {
          console.error('Error deleting file from Cloudinary:', cloudinaryError);
        }
      }
    }
    
    await NoticeModel.findByIdAndDelete(noticeId);
    
    res.json({ 
      success: true,
      message: "Notice deleted successfully" 
    });
  } catch (error) {
    console.error('Notice deletion error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting notice", 
      error: error.message 
    });
  }
};



const getNotices=async(req, res) => {
  try {
    const userId = req.userId;
    
    const query = { CreaterId: userId };

    const notices = await NoticeModel.find(query).sort({ createdAt: -1 });
    
    if (!notices || notices.length === 0) {
        return res.status(404).json({ 
            success: false,
            message: "No notices found" 
        });
    }
    
    res.json({
        success: true,
        count: notices.length,
        notices: notices
    });
} catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ 
        success: false,
        message: "Error fetching notices", 
        error: error.message 
    });
}

}



module.exports = {
  upload,
  createNotice,
  updateNotices,
  deleteNotices,
  getNotices
};




