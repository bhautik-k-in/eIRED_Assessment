const mongoose = require('mongoose')

const tasksSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Completed', 'Incomplete'],
        default: 'Incomplete'
    },
    date: {
        type: Date,
        required: true
    },
    sequence: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USERS'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false, timestamps: true
});

module.exports = mongoose.model('TASKS', tasksSchema);