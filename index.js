const express = require('express');
require('dotenv').config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const {adminRouter} = require("./Route/admin");
const {userRouter} = require("./Route/user");
const app = express();






app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/admin",adminRouter);
app.use("/user",userRouter);











async function main() {
    await mongoose.connect(process.env.MONGOOSE_URL)
    app.listen(process.env.PORT);
    console.log(`listening on port ${process.env.PORT}`)
}



main();

