const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
//validation
const { registerValidation,loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

//lets validate
const { error }  = registerValidation(req.body);
if (error) return res.status(400).send(error.details[0].message);
//check if user is already in database
const emailExist = await User.findOne({email: req.body.email});
if(emailExist) return res.status(400).send("Email Already Exists");

//Hash password
const salt = await bcrypt.genSalt(10);
const hashPassword = await bcrypt.hash(req.body.password, salt);
//create a new user
const user = new User({
  name:req.body.name,
  email:req.body.email,
  password: hashPassword
});
try{
  const savedUser = await user.save();
  res.send({user: user._id} );

}catch(err){
  res.status(400).send(err);
}
});

router.post('/login', async (req, res) => {
  const { error }  = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send('Email or password is wrong');
  //PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if(!validPass) return res.status(400).send('Invalid password')
  //create and assign a jwt token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token',token).send(token);
});

module.exports = router;
