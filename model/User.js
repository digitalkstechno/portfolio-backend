const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  pin: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

userSchema.virtual("isLocked").get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.methods.comparePin = async function(candidatePin) {
  return await bcrypt.compare(candidatePin, this.pin);
};

userSchema.methods.incLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { attempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates = { $inc: { attempts: 1 } };
  if (this.attempts + 1 >= 3 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 10 * 60 * 1000 };
  }

  return await this.updateOne(updates);
};

userSchema.methods.resetAttempts = async function() {
  return await this.updateOne({
    $set: { attempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

module.exports = mongoose.model("User", userSchema);
