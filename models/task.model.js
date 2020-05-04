const mongoose = require('mongoose');
const { Schema } = mongoose;

const task_schema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        default: '',
    },
    created_at: {
        type: Number,
        default: Date.now(),
        required: true
    },
    updated_at: {
        type: Number,
        default: Date.now(),
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    managers: [{
        type: String,
        default: ''
    }],
    employees: [{
        type: String,
        default: ''
    }],
    time_alloted: {
        task_start: {
            type: Number,
            default: Date.now()
        },
        task_end: {
            type: Number,
            default: Date.now() + 604800000
        }
    }
})

const Task = mongoose.model('Task', task_schema)

exports.Task = Task;