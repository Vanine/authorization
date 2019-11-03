var router = require('express').Router();
const bcrypt = require('bcryptjs');
var User = require('../models/user');

router.post('/signup', (req, res) => {
    let obj;
    console.log(req.body);
    console.log("mtav posty");
    for(var key in req.body) {
       obj = JSON.parse(key)
        }
        var user = new User({
            name: obj.name,
            email: obj.email,
            number: obj.number,
            password: obj.password
        })
        console.log(user);
        
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt)
            .then(hash => {
                user.password = hash
            })
            .then(result => {
                user.save((error)=>{
                    if (error) return error;
                    console.log("pahec");
                return res.json({message: 'You are now registered'})
                })
                
            })
            .catch(err => {
                return res.json({message: err})
            }); 
});
});

module.exports = router;