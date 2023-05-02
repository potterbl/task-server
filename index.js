import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import multer from 'multer'

import * as userController from './controllers/UserController.js'

import {registerValidation, loginValidation, taskValidation} from "./validation/validations.js";
import handleValidationsError from "./validation/handleValidationsError.js";

import dotenv from 'dotenv';
dotenv.config();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/')
    },
    filename: (_,file, cb) => {
        cb(null, Date.now() + '-' + file.originalname )
    }
})
const upload = multer({ storage: storage })


const connectionString = process.env.MONGO_CONNECT;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

mongoose
    .connect(process.env.MONGO_CONNECT)
    .then(() => {console.log('DB ok')})
    .catch((err) => {console.log('DB error', err)})

const app = express()

app.use(express.json())
app.use(cors())

app.post('/auth/login', loginValidation, handleValidationsError, userController.login)
app.post('/auth/register', upload.single('avatar'), registerValidation, handleValidationsError, userController.register);
app.post('/task/create/:token', handleValidationsError, userController.createTask)

app.get('/auth/:token', userController.getOne)
app.use('/uploads', express.static('uploads'))

app.delete('/task/delete/:token/:taskId', userController.removeTask)
app.patch('/task/change/:token/:taskId', userController.updateTask)

app.listen(process.env.PORT || 4444, (err) => {
    if(err){
        return console.log(err)
    }

    console.log('Server ok')
})