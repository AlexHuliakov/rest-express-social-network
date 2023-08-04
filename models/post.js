const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true // title is required
    },
    content: {
        type: String,
        required: true // content is required
    },
    imageUrl: {
        type: String,
        required: true // imageUrl is required
    },
    // creator: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true // creator is required
    // }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
