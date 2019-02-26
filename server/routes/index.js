// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the game model
let book = require('../models/books');
let userModel = require('../models/user');
let user = userModel.User;

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    books: ''
   });
});
//GET login page
router.get('/login', (req,res,next) =>
{
if(!req.user) {
  res.render('auth/login',{
    title:"Login",
    messages: req.flash('loginMessage'),
    displayName: req.user ? req.user.displayName : ''
  });
}
else
{
  return res.redirect('/');
}
});
//process login page
router.post('/login',  passport.authenticate('local', {
  successRedirect: '/books',
  failureRedirect: '/login',
  failureFlash: 'bad login',
  failureMessage: 'bad login'
}));
//GET register page
router.get('/register',(req, res, next) => {
  if(!req.user) {
    res.render('auth/register', {
      title: "Register",
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
    });

  } else {
    return res.redirect('/'); // user is already registered
  }
});
//Process the register page
router.post('/register',(req, res, next)=>{

  let newUser = new user({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  });

  user.register(
    newUser,
    req.body.password,
    (err) => {
      // check if there is an error
      if(err) {
        console.log('Error creating new user');
        if(err.name == "UserExistsError") {
          req.flash('registerMessage', 'Registration Error: User Already Exists');
        }
        return res.render('auth/register', {
          title: "Register",
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
        });
      }
      
      return passport.authenticate('local')(req, res, ()=>{
        res.redirect('/login');
      });
    });
});
//Logout from application
router.get('/logout',(req, res, next) => {
  req.logout();
  res.redirect('/'); 
});


module.exports = router;
