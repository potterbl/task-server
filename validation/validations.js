import {body} from 'express-validator'

export const registerValidation = [
    body('email').isString(),
    body('password').isLength({min: 6}).isString(),
    body('avatarUrl').optional().isURL(),
    body('tasks').optional(),
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