const { response } = require('express');
var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helper');
/* GET users listing. */

router.get('/', (req, res, next) => {
  let user = req.session.user

  if (user) {
    userHelpers.getAllDetails(user).then((data)=>{
      
      res.render('users/user-index', {user,data});
      
    })
    
  }
  else {
    res.redirect('/')
  }
})

// router.post('/sort-date',(req,res)=>{
//   let date=req.body
//   console.log(date)
//   res.redirect('user/user')
// })

router.get('/add-journal', (req, res) => {
  let user = req.session.user
  if (user) {
    let user = req.session.user
 
    res.render('users/add-journal',{user})
  }
  else{
    res.redirect('/')
  }
})
router.post('/add-journal', (req, res) => {
  let user = req.session.user
  if (user) {
    userHelpers.addDetails(user._id, req.body).then(() => {
      res.redirect('/user')

    })
  }
  else {
    res.redirect('/')
  }
})
module.exports = router;
