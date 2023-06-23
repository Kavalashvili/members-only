const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    text: { type: String, required: true, maxLength: 1000 },
    timestamp: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

// virtual for message URL
MessageSchema.virtual('url').get(function () {
    return `message/${this._id}`;
});

module.exports = mongoose.model('Message', MessageSchema);