import bcrypt from 'bcrypt'
import jwt from'jsonwebtoken'
import {v4 as uuidv4} from 'uuid'
import UserModel from "../models/UserModel.js";
export const register = async (req,res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const passHash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
            tasks: req.body.tasks,
            passwordHash: passHash,
        })

        const user = await doc.save()

        const token = jwt.sign({
                _id: user._id,
            },
            'tasksManagement',
            {
                expiresIn: '1000d',
            }
        )

        const {passwordHash, _id, ...userData} = user._doc

        res.json({...userData, token})
    } catch (err) {
        res.status(500).json({
            message: "Не удалось зарегестрироваться",
            log: err,
        })
    }
}

export const login = async(req,res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            })
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'tasksManagement',
            {
                expiresIn: '1000d'
            }
        )

        const {passwordHash, _id, ...userData} = user._doc

        res.json({...userData, token})
    } catch (err) {
        res.status(500).json({
            message: "Не удалось авторизоваться",
            log: err,
        })
    }
}

export const getOne = async (req,res) => {
    try{
        const token = req.params.token
        const decoded = jwt.verify(token, 'tasksManagement')

        const user = await UserModel.findOne({_id: decoded})

        const {passwordHash, _id, ...userData} = user._doc

        res.json(userData)
    } catch (err) {
        res.status(500).json({
            message: "Не удалось найти пользователя",
            log: err,
        })
    }
}

export const createTask = async (req, res) => {
    try {
        const userToken = req.params.token;
        const decoded = jwt.verify(userToken, 'tasksManagement')
        const newTask = {
            id: uuidv4(),
            task: req.body.task,
            priority: req.body.priority,
            done: req.body.done,
        };

        const updatedUser = await UserModel.findOneAndUpdate(
            {
                _id: decoded
            },
            {
                $push: { tasks: newTask }
            },
            {
                new: true
            }
        );

        res.json(updatedUser);

    } catch (err) {
        res.status(500).json({
            message: "Не удалось добавить задачу",
            log: err,
        });
    }
};
export const removeTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const token = req.params.token
        const decoded = jwt.verify(token, 'tasksManagement')

        const user = await UserModel.findOne({_id: decoded})
        const userId = user._id
        const taskIndex = user.tasks.findIndex((task) => {
            return task.id === taskId;
        });

        if (taskIndex === -1) {
            return res.status(404).json({
                message: "Задача не найдена",
            });
        }

        user.tasks.splice(taskIndex, 1);

        const updatedUser = await UserModel.findOneAndUpdate(
            {
                _id: userId
            },
            {
                $set: { tasks: user.tasks }
            },
            {
                new: true
            }
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({
            message: "Не удалось удалить задачу",
            log: err,
        });
    }
};
export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const token = req.params.token
        const decoded = jwt.verify(token, 'tasksManagement')

        const user = await UserModel.findOne({_id: decoded})
        const userId = user._id
        const taskIndex = user.tasks.findIndex((task) => {
            return task.id === taskId;
        });

        if (taskIndex === -1) {
            return res.status(404).json({
                message: "Задача не найдена",
            });
        }

        user.tasks[taskIndex].done = !user.tasks[taskIndex].done

        const updatedUser = await UserModel.findOneAndUpdate(
            {
                _id: userId
            },
            {
                $set: { tasks: user.tasks }
            },
            {
                new: true
            }
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({
            message: "Не удалось обновить задачу",
            log: err,
        });
    }
};
