import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
 
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    unique: true,
    default: () => uuidv4(),
  },
  resetToken: String,
  resetTokenExpire: Date,
  fcmToken: { 
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: '',
  },
  section: {
    type: String,
    default: '',
  },
  profilePic: {
    type: String,
    default: '',
  },
  userSkills: [{
    name: String,
    level: Number,
    color: String,
    dateAdded: { type: Date, default: Date.now },
  }],
  userProgress: {
    tasksCompleted: { type: Number, default: 0 },
    organizationsJoined: { type: Number, default: 0 },
    activeDays: { type: Number, default: 0 },
    projectsCollaborated: { type: Number, default: 0 },
    skillsCertified: { type: Number, default: 0 },
    improvementsSuggested: { type: Number, default: 0 },
    loginStreak: { type: Number, default: 0 },
    lastLoginDate: { type: Date },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
