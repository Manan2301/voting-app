const mongoose = require('mongoose')

const VoteSchema =  new mongoose.Schema({
    candidate: {
        type: String,
        required: true,
        trim: true
    },
    points:{
        type:String,
        required:true
    },
    by:{
        type:String,
    },
    // owner:{ 
    //     type:mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // }
},
{
    timestamps: true
})
const Vote = mongoose.model('Vote', VoteSchema)//collection creation in db
module.exports = Vote  