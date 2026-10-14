// login and registering for a user is done here
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/Userschema.js';

const router = express.Router();

const withoutPassword = (user) => {
  const { password, ...rest } = user.toObject();
  return rest;
};

// register
router.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newuser = new User({
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: hashedPassword,
      institution: req.body.institution,
      desc: req.body.desc,
      profilePicture: req.body.profilePicture,
    });

    const user = await newuser.save();
    res.status(200).json(withoutPassword(user));
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: 'user not found' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json('wrong password');

    res.status(200).json(withoutPassword(user));
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
