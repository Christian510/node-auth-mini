require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const strategy = require(`${__dirname}/strategy.js`);
const students = require('./students.json');

const app = express();

app.use( session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false
  }));
  app.use( passport.initialize() );
  app.use( passport.session() );
  passport.use( strategy );

  passport.serializeUser(function(user, done) {
    done(null, { id: user.id, display: user.displayName, nickname: user.nickname, email: user.emails[0].value });
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  app.get( '/login',
  passport.authenticate('auth0',
    { successRedirect: '/students', failureRedirect: '/login', connection: 'github' }
  )
);

function authenticated(req, res, next){

}

app.get('/students', ( req, res, next) => {
      res.status(200).send( students );
});

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );