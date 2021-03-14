const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken')
const Vote = require('./vote.js')

const userSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }    
    },
    gender: {
        type: String,
        required:true, 
    },
    tokens:[{
        token: { // subdocument (have its own ObjectId as well)
            type: String,
            required:true
        }
    }],
    avatar:{// saves the uploaded files alongside other items of the model in the database
        type: Buffer 
    }
},{
    timestamps: true 
})


//instead of making a real(not virtual) field in the databse like owner in Task model we create it differently
//to describe the reverse relationship(tasks created by the particular user), we use virtual 
userSchema.virtual('vote', {
    ref:'Vote',
    localField: '_id',    //relationship between the field here
    foreignField: 'candidate' // and the field over there
})//not stored in database, just for mongoose to understand relationship



//Statics can be called with model like we did in router user.js( Users.findByCredentials)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('Unable to login')    
    }
    
    const isMatch =  await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        throw new Error('Unable to login')
    }  
    
    return user   
}


//methods work with instances( like in router user.js --> user.generateAuthToken) unlike statics which work with models
userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token: token }) 
    await user.save()
    return token
       
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

//setting up middleware to hash the plain text password before saving
userSchema.pre('save', async function (next){
    const user =  this
    if(user.isModified('password')){ // if a new user is created or existing one updated the password
         user.password = await bcrypt.hash(user.password, 8)
    }    
    next()
    
})

//some requests such as patch bypass mongoose so can't detect middleware, so we have to make changes
//in patch route in the user file of routers folder


//Another middleware to delete associated tasks if user deletes the account
/*userSchema.pre('remove', async function (next) {
    const user = this 
    await Task.deleteMany({owner: user._id})
    next()
})
*/
const User = mongoose.model('User', userSchema)
module.exports = User 