const mongoose = require('mongoose')


const chatSchema = new mongoose.Schema({

    userId:{
        type:String,
        required:true
    },
    messages:[
        {sender:{
            type:String,
            required:true
        },
         text:{
            type:String,
            required:true
         },
         timeStamp:{
            type: Date,
            default: Date.now
         }
        }]
});


module.exports = mongoose.model('chat',chatSchema);
