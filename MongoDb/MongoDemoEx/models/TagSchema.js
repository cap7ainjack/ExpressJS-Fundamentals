const mongoose = require('mongoose');

let tagSchema = mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        require: true
    },
    creationDate: {
        type: mongoose.Schema.Types.Date,
        require: true,
        default: Date.now() //check is correct
    },
    description: {
        type: mongoose.Schema.Types.String
    },
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image'
        }
    ]

})

tagSchema.methods.nameToLowerCase = function () {
    return this.name.toLowerCase();
}

let Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;