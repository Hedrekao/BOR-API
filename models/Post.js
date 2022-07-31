const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
})


module.exports = mongoose.model('Posts', postSchema)