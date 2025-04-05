const { Router } = require("express");
const adminRouter = Router();
const { signup, signin, authMiddleware} = require('../Controller/admin');
const { upload, createNotice,updateNotices } = require('../Controller/notice');


adminRouter.post('/signup', signup);
adminRouter.post('/signin', signin);
adminRouter.post('/notices',authMiddleware,upload.single('noticeFile'), createNotice );
adminRouter.put('/notices/:id',authMiddleware ,updateNotices);





module.exports = {adminRouter};