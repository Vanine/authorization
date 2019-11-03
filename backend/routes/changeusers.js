var router = require('express').Router();
var User = require('../models/user');

router.get('/users', function(req, res) {  
    if(!req.query.q && !req.query.p && !req.query.l) {
        User.paginate({}, {page: 1, limit: 10})
        .then(result => {
          res.json({users: result.docs, pageCount: result.totalPages})
        })
        .catch(err=>{
          console.log(err)
        })
      }
      else if(req.query.p && req.query.l && !req.query.q) {
          User.paginate({}, {page: req.query.p, limit: req.query.l})
          .then(result => {
            res.json({users: result.docs, pageCount: result.totalPages})
          })
          .catch(err=>{
            console.log(err)
          })
      }
      else {
        User.paginate({'name': {$regex: '.*' + req.query.q + '.*'}}, {page: req.query.p, limit: req.query.l})
      .then(result => {
        res.json({users: result.docs, pageCount: result.totalPages})
      })
      .catch(err=>{
        console.log(err)
      })
      }
});

    router.post('/users/delete', (req, res) => {
     let obj;
      for(var key in req.body) {
        obj = JSON.parse(key)
         }
    console.log(obj);
      User.deleteOne({ _id: obj._id }, (err) => {
        if(err) res.json({message: `${err}`})
        else res.json({message: 'Document is removed'});
        console.log("error chkar");
    })
});

router.post('/users/update', (req, res) => {
    let obj;
  for(var key in req.body) {
    obj = JSON.parse(key)
     }
  console.log(obj);
  User.findOne({ _id: obj._id })
  .then(user=> {
    user.name = obj.name;
    user.email = obj.email;
    user.number = obj.number;
    user.save().then(res.json({message: 'Document is changed'}));
  })
  .catch(err => res.json({message: `${err}`}));
  });


module.exports = router;  