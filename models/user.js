const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 30 },
    last_name: { type: String, required: true, maxLength: 50 },
    username: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true, maxLength: 200 },
    isMember: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
})

// visrtual for user's full name
UserSchema.virtual('name').get(function () {
    let fullname = '';
    if (this.first_name && this.last_name) {
        fullname = `${this.first_name} ${this.last_name}`;
    }
    return fullname;
});

// virtual for user's URL
UserSchema.virtual('url').get(function () {
    return `user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);