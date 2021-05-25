const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');
const Post = require('./post')

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required']
    }
})

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = User;



