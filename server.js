const passport = require('passport');
const express = require('express');
const app = express();
const SpotifyStrategy = require('passport-spotify').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/butterfy');

const UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    spotifyId: String,
    spotifyToken: String,
});
const User = mongoose.model('User', UserSchema)

passport.use(
  new SpotifyStrategy(
    {
      clientID: 'cd56fa5cc82a4e3baf4d113627e0ba84',
      clientSecret: '577e4ba0465544eb947fc7dafb92d228',
      callbackURL: 'http://localhost:3000/auth/spotify/callback',
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = new User({
                email: profile.emails[0].value,
                username: profile.displayName,
                spotifyId: profile.id,
                spotifyToken: accessToken,
            });
            await user.save();
        } else {
            user.spotifyId = profile.id;
            user.spotifyToken = accessToken;
            await user.save();
        }
        return done(null, profile);
    }
  )
);

app.get('/', (req, res) => {
    res.send('Welcome to Butterfy API!');
});

app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email, 
        username,
        password: hashedPassword,
    });

    await newUser.save();
    res.send('User created');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send('Invalid password');
    
    res.send('Logged in successfully');
  });

app.use(passport.initialize());

app.get('/auth/spotify', passport.authenticate('spotify'));

app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Spotify login successful:', req.user);
    res.send('Logged in with Spotify!');
  }
);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
});
