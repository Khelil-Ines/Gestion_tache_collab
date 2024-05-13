const mongoose = require("mongoose")

const userSchema =  mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password : {type: String, required: true},
    lastname : {type: String},
    firstname : {type: String},
    descriptionprofile: {type: String},
    role: { type: String,
            enum : ["developer","manager","collaborator"],
            default: 'manager'
    },

    photo:{type: String},
    projects: [{
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        required: false
    }],
    bio : {type : String, default: ""},
})

module.exports = mongoose.model("User", userSchema)