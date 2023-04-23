import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import * as userController from './controllers/UserController.js'

import {registerValidation, loginValidation, taskValidation} from "./validation/validations.js";
import handleValidationsError from "./validation/handleValidationsError.js";
import {getOne, updateTask} from "./controllers/UserController.js";

mongoose
    .connect('mongodb+srv://zeexample42:vladvador08@task.odoq9p9.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {console.log('DB ok')})
    .catch((err) => {console.log('DB error', err)})

const app = express()

app.use(express.json())
app.use(cors())

app.post('/auth/login', loginValidation, handleValidationsError, userController.login)
app.post('/auth/register', registerValidation, handleValidationsError, userController.register)
app.post('/task/create/:token', taskValidation, handleValidationsError, userController.createTask)

app.get('/auth/:token', userController.getOne)

app.delete('/task/delete/:token/:taskId', userController.removeTask)
app.patch('/task/change/:token/:taskId', userController.updateTask)

app.listen(4444, (err) => {
    if(err){
        return console.log(err)
    }

    console.log('Server ok')
})