const { Router } = require("express");
const adminRouter = Router();
const { signup, signin, authMiddleware} = require('../Controller/admin');
const { upload, createNotice,updateNotices,deleteNotices } = require('../Controller/notice');


adminRouter.post('/signup', signup);
adminRouter.post('/signin', signin);
adminRouter.post('/notices',authMiddleware,upload.single('noticeFile'), createNotice );
adminRouter.put('/update-notices/:id',authMiddleware ,updateNotices);
adminRouter.delete('/delete-notices/:id',authMiddleware,deleteNotices);





module.exports = {adminRouter};