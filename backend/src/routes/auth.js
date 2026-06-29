const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const DISCORD_API = 'https://discord.com/api/v10';

// Discord OAuth2 Callback
router.post('/discord-callback', async (req, res) => {
  try {
    const { code } = req.body;

    // Get access token
    const tokenResponse = await axios.post(`${DISCORD_API}/oauth2/token`, null, {
      params: {
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.FRONTEND_URL}/callback`
      }
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { id, username, avatar, email } = userResponse.data;

    // Get user guilds
    const guildsResponse = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const managedGuilds = guildsResponse.data
      .filter(guild => (guild.permissions & 0x8) === 0x8)
      .map(guild => guild.id);

    // Create or update user
    let user = await User.findOne({ discordId: id });
    if (!user) {
      user = new User({
        discordId: id,
        username,
        avatar,
        email,
        managedGuilds
      });
    } else {
      user.username = username;
      user.avatar = avatar;
      user.email = email;
      user.managedGuilds = managedGuilds;
    }

    await user.save();

    // Create JWT
    const token = jwt.sign(
      { discordId: id, username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        discordId: id,
        username,
        avatar,
        managedGuilds
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.user.discordId });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
