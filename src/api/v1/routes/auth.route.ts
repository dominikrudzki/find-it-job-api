import express from 'express'
import { body } from 'express-validator'
import { register } from "../controllers/register.controller"
import { login, loginTest } from "../controllers/login.controller"
import { authenticateToken } from "../../../middlewares/authenticateToken"
import { refreshToken } from "../controllers/refreshToken.controller"

const router = express.Router()

router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('employer').isBoolean(),
    register
)

router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    login
)

router.post(
    '/v1/login-test',
    authenticateToken,
    loginTest
)

router.post(
    '/v1/refresh-token',
    refreshToken
)

export default router
