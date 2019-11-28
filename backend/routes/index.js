var router = require('express').Router();
router.use('/', require('./reset')); 
router.use('/', require('./changeusers'));  
router.use('/', require('./signin'));  
router.use('/', require('./signup'));  
module.exports = router; 