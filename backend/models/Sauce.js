const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema({
    userId: { type: String, required: true, inmutable: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageURL: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default: 0 },
    usersLikes: { type: [String], required: true },
    usersDislikes: { type: [String], required: true }
});


module.exports = mongoose.model('Sauce', sauceSchema)

