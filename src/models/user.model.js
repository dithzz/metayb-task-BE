const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const { toJSON, paginate } = require('./plugins')
const { roles } = require('../config/roles')

const productionSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  }
}, { _id: false })

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    designation: {
      type: String,
      trim: true,
    },
    sex: {
      type: String,
      trim: true,
      default: 'male',
    },
    dateofJoining: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    currentLogin: {
      type: Date,
      default: null,
    },
    timeSpent: {
      type: Number, // time spent in seconds
      default: 0,
    },
    dailyProduction: {
      type: [productionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
userSchema.plugin(toJSON)
userSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
  return !!user
}

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this
  return bcrypt.compare(password, user.password)
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

/**
 * Record login
 */
userSchema.methods.recordLogin = async function () {
  const user = this
  user.lastLogin = new Date()
  user.currentLogin = new Date()
  await user.save()
}

/**
 * Record logout and update time spent
 */
userSchema.methods.recordLogout = async function () {
  const user = this;
  const logoutTime = new Date();
  const sessionDuration = (logoutTime - user.currentLogin) / 1000; // in seconds
  
  // Update time spent
  user.timeSpent += sessionDuration;

  // Handle daily production
  const today = logoutTime.toDateString();
  const productionToday = user.dailyProduction.find(prod => prod.date.toDateString() === today);

  if (productionToday) {
    productionToday.amount += sessionDuration;
  } else {
    user.dailyProduction.push({ date: logoutTime, amount: sessionDuration });
  }

  // Reset currentLogin
  user.currentLogin = null;
  
  await user.save();
};

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema)

module.exports = User
