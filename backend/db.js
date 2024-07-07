const mongoose = require('mongoose');
const { number } = require('zod');

mongoose.connect("mongodb://localhost:27017/paytm");
const userSchema=new mongoose.Schema({
    name:String,
    password:String,
    firstName:String,
    lastName:String
});

const accountSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.objectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const User=mongoose.model('User',userSchema);
const Account=mongoose.model('account',accountSchema)
module.exports=
({
    User,
    Account
})