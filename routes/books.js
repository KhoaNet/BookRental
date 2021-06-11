const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Gener = require('../models/geners')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

router.get('/',ensureAuthenticated, async (req, res) => {

  try {
    const books = await Book.find({});
    res.render('books/index', {
      books: books,
    })
  } catch {
    res.redirect('/')
  }
})

// New Book Route
router.get('/new',ensureAuthenticated, async (req, res) => {
  renderNewPage(res, new Book())
})

// Create Book Route
router.post('/new',ensureAuthenticated, async (req, res) => {
  const book = new Book({
    title: req.body.title,
    gener: req.body.gener,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })

  saveCover(book, req.body.cover)

  try {
    const newBook = await book.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`/books`)
  } catch {
    renderNewPage(res, book, true)
  }
})

router.get('/edit/:id',ensureAuthenticated, async (req, res) => {
  try {
      const book = await Book.findById(req.params.id);
      const geners = await Gener.find({})
      res.render('books/edit', { book: book,geners:geners })
  } catch {
      res.redirect('/books')
  }
})

router.post('/edit',ensureAuthenticated, async (req, res) => {
  let book 
  try {
      book = await Book.findById(req.body._id)
      book.title= req.body.title,
      book.gener= req.body.gener,
      book.publishDate= new Date(req.body.publishDate),
      book.pageCount= req.body.pageCount,
      book.description= req.body.description
      saveCover(book, req.body.cover)
      await book.save()
      res.redirect(`/books`)
  } catch {
      if(book == null){
          res.redirect('/')
      } else{
      res.render('books/edit', {
          book: book,
          errorMessage: 'Error updating Authod'
      })
  }
  }
})

router.get('/delete/:id',ensureAuthenticated, async (req, res) => {
  try {
      await Book.findByIdAndRemove(req.params.id);
      res.redirect('/books')
  } catch {
      res.redirect('/books')
  }
})


router.get('/detail/:id',ensureAuthenticated, async (req, res) => {
  try {
      const book = await Book.findById(req.params.id);
      const geners = await Gener.find({})
      res.render('books/detail', { book: book,geners:geners })
  } catch {
      res.redirect('/')
  }
})

async function renderNewPage(res, book, hasError = false) {
  try {
    const geners = await Gener.find({})
    res.render('books/new',{geners: geners,book: book} )
  } catch {
    res.redirect('/books')
  }
}

function saveCover(book, coverEncoded){
  if (coverEncoded == null) return 
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}
module.exports = router