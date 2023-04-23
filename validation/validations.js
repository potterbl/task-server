import {body} from 'express-validator'

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    body('avatarUrl').optional().isURL(),
    body('tasks').optional().isArray(),
]

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 6})
]

export const taskValidation = [
    body('task').isString(),
    body('priority').isString(),
    body('done').isBoolean(),
]