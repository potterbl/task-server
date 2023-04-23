import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true,
    }
})