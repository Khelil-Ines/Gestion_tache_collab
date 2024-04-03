const mongoose = require("mongoose");

const tacheSchema = mongoose.Schema({

    nom : { type : String, required: false},
    etat :{type : String,  enum: ["To Do","In progress","Done"] , required: false},
    description : {type : String, default: ""},
    présence : {type:Boolean,default:false},
    responsable: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
        type: mongoose.Types.ObjectId,
        ref: 'project',
        required: true,
      },
    createdAt: { type: Date, default: () => moment().toDate() },
    //file
    date_limite:{type :Date, required:true},

});

module.exports = mongoose.model("Tache", tacheSchema);