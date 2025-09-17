import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 6,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    }
});
const user = mongoose.model('user', userSchema);
export default user;