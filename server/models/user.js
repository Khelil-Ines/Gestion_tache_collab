const mongoose = require("mongoose")

const userSchema =  mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password : {type: String, required: true},
    lastname : {type: String},
    firstname : {type: String},
    photo:{type: String},
    projects: [{
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        required: false
    }]
})

module.exports = mongoose.model("User", userSchema)