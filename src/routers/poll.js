const express = require('express')
const path = require('path')
const auth = require('../middleware/auth')
const Vote = require('../models/vote')
const hbs = require('hbs')
const mongoose = require('mongoose')
const cors= require('cors')
//const auth = require('../middleware/auth')
//const Task = require('../models/tasks')
const router = new express.Router()
const app = express()
const pathTopublic = path.join(__dirname, '../public')
const viewspath = path.join(__dirname, '../templates/views')// if we want to use non default templates instead of default views
const partialsPath = path.join(__dirname, '../templates/partials')
app.use(cors())


const Pusher = require('pusher')
var pusher = new Pusher({
    appId: "1169832",
    key: "2d4454b084d59ea08a0b",
    secret: "1bf815f35375ffe4791a",
    cluster: "ap2",
    useTLS: true
  });



router.get('/',cors(), (req,res) => {

    try{
      Vote.find().then(votes => res.json({ success: true, votes: votes }));
    } catch (e) {
      res.status(400).send(e)
    }
}) 
router.post('/', async (req, res) => {
  try {
      //const candidate= await Vote.findByCredentials(req.body.candidate)
      //candidate[votecount]+=1
      //await candidate.save()
      const NewVote = {
        candidate:req.body.candidate,
        points:1,
        
        //owner: req.user._id 
      }
      //const uservote = new Vote(NewVote)
      //await uservote.save()//save in db
      new Vote(NewVote).save().then(vote => {
        pusher.trigger('candidate-poll', 'vote', {// subscribe this event on the client/frontend side
        candidate:vote.candidate ,
        points:parseInt(vote.points) //points saved as string in db     
        });
      })  
      return res.json({success:true, message:'Thank you for voting'})
    } catch (e) {
      res.status(400).send(e)
      
  }
})
  







module.exports = router