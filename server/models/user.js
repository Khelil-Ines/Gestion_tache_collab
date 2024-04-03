const mongoose = require("mongoose")

const userSchema =  mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password : {type: String, required: true},
    lastname : {type: String},
    firstname : {type: String},
    role: { type: String,
            enum : ["developer","manager","collaborator"],
            default: 'manager'
    },
    photo:{type: String}
})

module.exports = mongoose.model("User", userSchema)