const { Router } = require("express");
const adminRouter = Router();
const { signup, signin, authMiddleware} = require('../Controller/admin');
const { upload, createNotice } = require('../Controller/notice');


adminRouter.post('/signup', signup);
adminRouter.post('/signin', signin);
adminRouter.post('/notices',authMiddleware,upload.single('noticeFile'), createNotice );





module.exports = {adminRouter};