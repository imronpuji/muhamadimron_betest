import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: Number,
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
    },
    identityNumber: {
        type: Number,
        required: true,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
