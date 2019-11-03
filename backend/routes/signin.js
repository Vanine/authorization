var router = require('express').Router();
var User = require('../models/user');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.post("/signin", (req, res) => {
    console.log(req.body);
    let obj;
    for(var key in req.body) {
       obj = JSON.parse(key)
    }
   console.log(obj);
   User.findOne({ email: obj.email})
    .then(user => {
        
        if (!user) {
            
            return res.json({message: 'No user with that email'})
        }
        bcrypt.compare(obj.password, user.password, (err, result) => {
          if (err) {
            return res.json({
                message: "Auth failed"
              });
          };
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id
              },
                'jwtsecret',
                {expiresIn: "1d"}
              
            );
            console.log("ka user");
            return  res.json({'message': token})
           }
           return res.json({'message': 'Incorrect password'})  
              });
        })
       .catch(err => {
        console.log(err);
        return  res.json({
          error: err
        })
    })
    });

module.exports = router;