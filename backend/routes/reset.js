var router = require('express').Router();
var User = require('../models/user');
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

router.post('/forgotPassword', (req, res) => {
    let obj;
    for(var key in req.body) {
      obj = JSON.parse(key)
       }
  console.log(obj);
    User.findOne({ email: obj.email })
    .then(user => {
      if (!user) {
         res.json({'message': 'No user with that email'})
      return}
      else {
        
        var token = Math.floor((Math.random() + 1) * 100000) - 100000
        user.token = `${token}`;
        user.expiresIn = Date.now() + 3600000;
        user.save();
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.ethereal.email',
          port: 465,
          secure: true, 
          auth: {
              user: 'vanine.ghazaryan01@gmail.com',
              pass: 'parol2018'  
          }
        });
        var mailOptions = {
          from: 'ghazaryanedita5@gmail.com',
          to: 'vanine.ghazaryan01@gmail.com',
          subject: 'Code for changing your password',
          text: `Click on the following link for changing your password http://localhost:3000/reset/${token}`
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) throw err;
          else {
          (console.log('Email sent: ', info.response))
          res.json({'message': 'Email sent'})
          }
        })
      }
      })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
  })
  });    
  
  router.post('/reset/:token', (req, res) => {
    let obj;
    console.log(req.params.token);
    
    for(var key in req.body) {
      obj = JSON.parse(key)
       }
      console.log(obj);
      User.findOne({token: req.params.token})
      .then(user => {
        if (!user || user.expiresIn < Date.now()) {
          res.json({'message': 'Something went wrong, please try again'})
          return
        }
        else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(obj.password, salt)
            .then(hash => {
                  console.log(user);
                  user.password = hash;
                  user.save();
                  res.json({'message': 'Password changed'});
            })
            .catch(err => console.log(err));
          })}
          })
       .catch(err => console.log(err));
  
    });

module.exports = router;