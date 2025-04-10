const { Router } = require("express");
const userRouter = Router();
const {signup,signin,authMiddleware}=require("../Controller/user");   
const {notices}=require("../Controller/notice")

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/notices',authMiddleware,notices);




module.exports = {userRouter};