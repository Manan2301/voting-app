const express = require('express')
const User = require('../models/users')
const router = new express.Router()
const sharp = require('sharp')
const auth = require('../middleware/auth')
const multer= require('multer')
const path = require('path')
const hbs = require('hbs')
//const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')
const app = express()

const pathTopublic = path.join(__dirname, '../public')
const viewspath = path.join(__dirname, '../templates/views')// if we want to use non default templates instead of default views
const partialsPath = path.join(__dirname, '../templates/partials')


//Setup static directory to be served
app.use(express.static(pathTopublic))

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewspath) // not needed if we use default views directory instead of templates
hbs.registerPartials(partialsPath)

// router.get('/', function(req,res){
//     res.sendFile('signup.hbs')
// })
// router.post('/users', async (req, res) => {
//     const user = new User({
//     name:req.body.name,
//     password:req.body.password,
//     email:req.body.email,
//     gender:req.body.gender});
//     await user.save()
//     res.sendFile('index.hbs')
//     /*
//     try {
//         await user.save()
//         //sendWelcomeEmail(user.email, user.name)
//         const token = await user.generateAuthToken()
//         res.status(201).send({ user, token })
//     } catch (e) {
//         res.status(400).send(e)
//     }
// */
// })

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.render('index.hbs')
                                    // what is to be stringified and sent , though it doesnt't need to be explicitly called
    } catch (e) {
        res.status(400).send()
    }
})
router.get('/users/render', async (req, res) => {
    try {
        return res.render('index.hbs')
    }catch(e){
        res.status(400).send()
    }
})    
// "tokens": [
//     {
//         "_id": "60007401e316e52346f9f3d6",
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDAwNzQwMWUzMTZlNTIzNDZmOWYzZDUiLCJpYXQiOjE2MTA2NDI0MzN9.xO_aWRrVty2YB8ECje57oN0ptTGWqmniDxflu6iv_Bk"
//     }
// ],

//req.user.tokens give the whole array
router.post('/users/logout', auth , async (req,res) =>{
    try{
        req.user.tokens=req.user.tokens.filter((token) => { // REFER ABOVE TOKEN STRUCTURE, req.user.tokens is the whole array and token is a single token object with properties _id and token                                  
            return token.token !== req.token // req.token comes from the auth file( AND we are removing the one with which user logged in )             
        })
        await req.user.save() //after logging out Postman doesn't automatically catch any previous login instances(tokens) and thus asks to authenticate
        // as it continues to send requests(say get profile) with the last logged in token 
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req,res) =>{
    try{
        req.user.tokens = [] 
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})  


router.get('/users/me',auth,  async (req, res) => {
    res.send(req.user) // now we saved resources since we don't have to get user again as we already 
    //got it in auth.js after the required authentication
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //const user = await User.findById(req.params.id)

        updates.forEach((update) => req.user[update] = req.body[update])
        // user[update] = req.body[update]
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)  
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
   // dest:'avatars', commented to allow sending the uploaded file to the database instead of storing it on the filesystem
    limits:{
        fileSize:1000000
    },// below is a type of validation
    fileFilter(req, file, cb){// cb is callback fnctn
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){ //     \.(doc|docx)$ is reg. exprsn. which starts looking from character(.)
                                                       // and looks for doc/docx
            return cb(new Error('Please upload an image'))//returns an error
        }
        cb(undefined,true)//accept and upload the file, false reject it
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => { //middleware upload.single('should matchwith key in form data' )
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next) => { // arguments must exactly match , its a signature function which helps in
                                // error handling
    res.status(400).send({error: error.message})// error. message comes from the middleware upload.single('avatar')(in between (req,res) and users/me/avatar)
})

router.delete('/users/me/avatar', auth , async(req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/:id/avatar', async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg') // set headers for response( automat. json data ut here we need img)
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})
module.exports = router