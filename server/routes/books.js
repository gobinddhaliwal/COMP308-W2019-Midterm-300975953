// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport')

// define the book model
let book = require('../models/books');

function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET books List page. READ */
router.get('/',requireAuth, (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add',requireAuth, (req, res, next) => {

      res.render('books/details', {
        title:'Add a new book',
        books: book
      });
    });


// POST process the Book Details page and create a new Book - CREATE
router.post('/add',requireAuth, (req, res, next) => {

    let newbook = book({
        "Title":req.body.title,
        "Price":req.body.price,
        "Author":req.body.author,
        "Genre":req.body.genre
    });
    book.create(newbook, (err, books) => {
      if(err) {
          console.log(err);
          res.end(err);
      } 
      else {
          res.redirect('/books');
      }
  });


});

// GET the Book Details page in order to edit an existing Book
router.get('/:id',requireAuth, (req, res, next) => {
  //Get the id parameter from the request
  let id=req.params.id;
  //Find the book by id from the book model and save it to bookfound
  book.findById(id, (err,bookfound) =>{
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
      //Render the details page with passing bookfound as a parameter
res.render('books/details',{
  title:"Edit the selected book",
  books:bookfound
});
    }
  });

    
});

// POST - process the information passed from the details form and update the document
router.post('/:id',requireAuth, (req, res, next) => {

    let id=req.params.id;
     let updated_book=book({
       "_id":id,
       "Title":req.body.title,
       "Price":req.body.price,
       "Author":req.body.author,
       "Genre":req.body.genre
     });
     book.update({_id:id},updated_book,(err) =>{
       if(err)
       {
         console.log(err);
         res.end(err);
       }
       else
       {
         res.redirect('/books');
       }
     })

});

// GET - process the delete by user id
router.get('/delete/:id',requireAuth, (req, res, next) => {

   let id=req.params.id;
   book.remove({_id:id},(err) =>{
     if(err)
     {
       console.log(err);
       res.end(err);
     }
     else
     {
       res.redirect('/books');
     }
   })
});


module.exports = router;
