import express from 'express'
import { body } from 'express-validator'
import { register } from "../controllers/register.controller"
import { login, loginTest } from "../controllers/login.controller"
import { authenticateToken } from "../../../middlewares/authenticateToken"
import { refreshToken } from "../controllers/refreshToken.controller"
import { changePassword } from "../controllers/changePassword.controller"
import { differentPassword } from "../../../middlewares/differentPassword"

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
    differentPassword,
    changePassword
)

router.post(
    '/refresh-token',
    refreshToken
)

// router.patch(
//     '/recover-password',
//     authenticateToken,
//     recoverPassword
// )

export default router
