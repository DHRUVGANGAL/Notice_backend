const { Router } = require("express");
const userRouter = Router();
const {signup,signin,authMiddleware}=require("../Controller/user");   

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/notices',authMiddleware,);



module.exports = {userRouter};