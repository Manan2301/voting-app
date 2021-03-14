const express = require('express')
const path = require('path')
const User = require('./models/users')
const Vote = require('./models/vote')
const cors= require('cors')
require('./db/mongoose')
//const taskRouter = require('./routers/task')
//const userRouter = require('./routers/user')
//const User = require('./models/users')
const poll= require('./routers/poll')
const bodyParser = require('body-parser')
const hbs = require('hbs')
const app = express()
const sharp = require('sharp')
//const user = require('./routers/user')

const pathTopublic = path.join(__dirname, '../public')
const viewspath = path.join(__dirname, '../templates/views')// if we want to use non default templates instead of default views
const partialsPath = path.join(__dirname, '../templates/partials')


//Setup static directory to be served
app.use(express.static(pathTopublic))

//Setup handlebars engine and views location
//app.engine('hbs',require('hbs').renderFile)
app.set('view engine', 'hbs')
app.set('views', viewspath) // not needed if we use default views directory instead of templates
hbs.registerPartials(partialsPath)
// express provides the methods for all types of HTTP requests

//ROUTE HANDLERS
app.use( express.static( path.join(__dirname, '../public') ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
//app.use(express.json())  //Automatically parse incoming json to an object which we can access in handlers
app.use(cors());

app.options('*', cors()) // include before other routes 

app.get('',cors(), function (req, res) {
    res.render('signup.hbs')
    //res.sendFile('index.hbs', {root: path.join(__dirname, '../templates/views')});
})


app.get('/favicon.ico', (req, res) => {
    // Use actual relative path to your .ico file here
    res.sendFile(path.resolve(__dirname, '../favicon.ico'));
  });
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    next();
})
// const csp = require('helmet-csp');

// app.use(csp({
//   policies: {
//       'default-src': [csp.SELF, 'http://localhost:3000/' ],
//       'script-src': [csp.SELF, csp.INLINE],
//       'style-src': [csp.SELF],
//       'img-src': ['data:', 'favico.ico'],
//       'worker-src': [csp.NONE],
//       'block-all-mixed-content': true
//   }
// }))  
app.post('/users', async (req, res) => {
    const user = new User({
    name:req.body.name,
    password:req.body.password,
    email:req.body.email,
    votecnt:1,
    gender:req.body.gender});
    await user.save()
    // pusher.trigger('login-event', 'logged', {// subscribe this event on the client/frontend side
    //   votedByid:req.body.email,
    //  //points saved as string in db     
    // });
    const token = await user.generateAuthToken()
    if(req.body.name=="admin" && req.body.email==="admin@evote.com" && req.body.password ==="adminroot101"){
        res.render('results.hbs', {root: path.join(__dirname, '../templates/views')}); 
    }else{
        res.render('index.hbs', {root: path.join(__dirname, '../templates/views')});
    }
    /*
    try {
        await user.save()
        //sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
*/
})

app.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        if(req.body.name=="admin" && req.body.email==="admin@evote.com" && req.body.password ==="adminroot101"){
          res.render('results.hbs', {root: path.join(__dirname, '../templates/views')}); 
        }else{
            res.render('index.hbs', {root: path.join(__dirname, '../templates/views')});
        }                                     
    } catch (e) {
        res.status(400).send()
    }
})
const Pusher = require('pusher')
var pusher = new Pusher({
    appId: "1169832",
    key: "2d4454b084d59ea08a0b",
    secret: "1bf815f35375ffe4791a",
    cluster: "ap2",
    useTLS: true
  });


// app.get('/',cors(), (req,res) => {

//     try{
//       Vote.find().then(votes => res.json({ success: true, votes: votes }));
//     } catch (e) {
//       res.status(400).send(e)
//     }
// }) 
// app.post('/vote', async (req, res) => {
//   try {
//       //const candidate= await Vote.findByCredentials(req.body.candidate)
//       //candidate[votecount]+=1
//       //await candidate.save()
//       const NewVote = {
//         candidate:req.body.choose,
//         points:1,
//         owner: req.user._id 
//       }
//       //const uservote = new Vote(NewVote)
//       //await uservote.save()//save in db
//       new Vote(NewVote).save().then(vote => {
//         pusher.trigger('candidate-poll', 'vote', {// subscribe this event on the client/frontend side
//         candidate:vote.candidate ,
//         points:parseInt(vote.points) //points saved as string in db     
//         });
//       })  
//       return res.json({success:true, message:'Thank you for voting'})
//     } catch (e) {
//       res.status(400).send(e)
      
//   }
// })
      
const csp = require('helmet-csp');
app.use(csp({
    directives: {
        defaultSrc:[`'self'`,`/`],
        imgSrc: [`'data:'`, `'favicon.ico'`],
    }
}));
//app.use(userRouter)
//app.use(taskRouter) 
app.use('/poll',poll)// router 
//app.use('/user',user)
//app.use(pollRouter  )
module.exports = app