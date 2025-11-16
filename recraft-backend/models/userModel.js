import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['Buyer', 'Artisan'],
        default: 'Buyer'
    },
     profileImage: {
        type: String,
        default: '' // Default to an empty string
    },
    contact: {
        phone: { type: String },
        address: { type: String }
    }
}, { timestamps: true,
});

userSchema.pre('save', async function (next){
    if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;