const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth  = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_KEY) //check if it is made up of the secret message we 
        //set and then decode it using the id field we embedded inside the token
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})//now its validated against secret message but we 
        // have to check, does our tokens array in our database contains the token or not, its there if the 
        //user is currently logged in
        if(!user){
            throw new Error()
        }
        req.user = user // to be used by the function which uses auth 
        req.token = token // to be used by the function which uses auth 
        next() 
    }catch{
        res.status(401).send({error:'please authenticate'})
    }
}


module.exports = auth