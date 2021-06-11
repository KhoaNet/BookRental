const express = require('express')
const router = express.Router()
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/',ensureAuthenticated, async (req, res) => {
  let users =  await User.find({});
  res.render('users/index', { title: 'Homepage', users:users })
 
})

// router.get('/edit/:id',ensureAuthenticated, async (req, res) => {
//   try {
//       const User = await User.findById(req.params.id);
//       res.render('users/edit', { User: User })
//   } catch {
//       res.redirect('/users')
//   }
// })
// router.post('/edit',ensureAuthenticated, async (req, res) => {
//   let User 
//   try {
//       User = await User.findById(req.body._id)
      
//       await User.save()
//       res.redirect(`/users`)
//   } catch {
//       if(User == null){
//           res.redirect('/')
//       } else{
//       res.render('users/edit', {
//           User: User,
//           errorMessage: 'Error updating Authod'
//       })
//   }
//   }
// })

module.exports = router