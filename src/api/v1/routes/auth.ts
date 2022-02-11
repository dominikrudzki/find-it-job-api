import express from 'express'
import { body } from 'express-validator'
import { register } from "../controllers/register.controller"
import { login, loginTest } from "../controllers/login.controller"
import { authenticateToken } from "../../../middlewares/authenticate-token"
import { refreshToken } from "../controllers/refresh-token.controller"
import { changePassword } from "../controllers/change-password.controller"

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
    '/login-test',
    authenticateToken,
    loginTest
)

router.patch(
    '/change-password',
    authenticateToken,
    body('password').isLength({min: 5}),
    body('newPassword').isLength({min: 5}),
    changePassword
)

router.post(
    '/refresh-token',
    refreshToken
)

export default router
