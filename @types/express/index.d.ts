import { jwtPayload } from "../../src/models/jwt-payload"

declare global {
    namespace Express {
        interface Request {
            jwtPayload?: jwtPayload
        }
    }
}
