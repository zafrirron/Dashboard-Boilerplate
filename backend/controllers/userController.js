const User = require('../models/User');

exports.findOrCreateUser = async ({ email, name, googleId }) => {
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, name, googleId, role: 'user' });
    await user.save();
  }
  return user;
};