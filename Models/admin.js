const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const adminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    departmentName: String,
    post: String
    
});



const admin = mongoose.model("Admin", adminSchema);

module.exports = admin;