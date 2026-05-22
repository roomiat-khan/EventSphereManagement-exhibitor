const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        enum: ['admin', 'organizer', 'exhibitor', 'attendee'],
        default: 'attendee'
    },

    phone: String,

    avatar: String,

    companyName: String,

    isApproved: {
        type: Boolean,
        default: true
    },

    // RESET PASSWORD FIELDS
    resetPasswordToken: {
        type: String
    },

    resetPasswordExpires: {
        type: Date
    }

}, { timestamps: true });


// HASH PASSWORD BEFORE SAVE
userSchema.pre('save', function () {

    if (!this.isModified('password')) return;

    this.password = bcrypt.hashSync(this.password, 10);

});


// COMPARE PASSWORD
userSchema.methods.comparePassword = function (enteredPassword) {

    return bcrypt.compareSync(enteredPassword, this.password);

};


module.exports = mongoose.model('User', userSchema);