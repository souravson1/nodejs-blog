const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);