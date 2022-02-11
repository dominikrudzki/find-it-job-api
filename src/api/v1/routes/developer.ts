import router from "./employer"
import { authenticateToken } from "../../../middlewares/authenticate-token"
import { getUserApplications } from "../controllers/get-user-applications.controller"
import { deleteUserApplication } from "../controllers/delete-user-application.controller"
import { applyForJob } from "../controllers/apply-for-job.controller"

router.get(
    '/get-user-applications',
    authenticateToken,
    getUserApplications
)

router.post(
    '/apply-for-job/:jobId',
    authenticateToken,
    applyForJob
)

router.delete(
    '/delete-apply-for-job/:jobId',
    authenticateToken,
    deleteUserApplication
)

export default router
