var express = require('express');
var router = express.Router();
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')

router.get('/', async function (req, res, next) {

  try {
    const admin = await Admin.where('username').equals(req.body.username)
    res.json(admin)
  } catch (error) {
    res.json({ message: e.message })
  }
});


// router.post('/', async (req, res) => {
//   const hashedPassword = await bcrypt.hash(req.body.password, 10)
//   const admin = new Admin({
//     username: req.body.username,
//     password: hashedPassword
//   })

//   try {
//     await admin.save()
//     console.log(admin)
//   } catch (error) {

//     res.json({ message: e.message })
//   }
// })

module.exports = router;
