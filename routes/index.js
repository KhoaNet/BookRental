const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Gener = require('../models/geners')

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/',ensureAuthenticated, async (req, res) => {
  try {
    const books = await Book.find({});
    res.render('index', {
      books: books,
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/home',ensureAuthenticated, async (req, res) => {
  try {
    const books = await Book.find({});
    res.render('index', {
      books: books,
    })
  } catch {
    res.redirect('/')
  }
})

// Welcome Page
//router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// // Dashboard
// router.get('/dashboard', ensureAuthenticated, (req, res) =>
//   res.render('dashboard', {
//     user: req.user
//   })
// );

module.exports = router